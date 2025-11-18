import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local')
  }

  const wh = new Webhook(SIGNING_SECRET)

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  const body = await req.text()

  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Unauthorized', {
      status: 400,
    })
  }

  const { id } = evt.data
  const eventType = evt.type

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id: clerkId, email_addresses, image_url, first_name, last_name } = evt.data
    const primaryEmail = email_addresses?.[0]?.email_address || ''

    try {
      await prisma.user.upsert({
        where: { clerkId },
        update: {
          email: primaryEmail,
          image_url: image_url || undefined,
        },
        create: {
          clerkId,
          id: clerkId,
          email: primaryEmail,
          image_url: image_url || undefined,
          profile: {
            create: {
              id: `profile_${clerkId}`,
              email: primaryEmail,
              name: `${first_name} ${last_name}`.trim(),
              role: 'teacher',
            },
          },
        },
      })
    } catch (error) {
      console.error('Error creating/updating user:', error)
    }
  }

  if (eventType === 'user.deleted') {
    try {
      await prisma.user.delete({
        where: { clerkId: id },
      })
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  return new Response('', { status: 200 })
}
