import { prisma } from '@/lib/prisma'

type TransactionType = 'scan_complete' | 'rating_bonus' | 'redemption' | 'milestone_bonus'

const COIN_RULES = {
  whatsapp_scan: 50,
  drone_scan: 80,
  soil_scan: 60,
  rating_5_bonus: 20,
  rating_4_bonus: 10,
}

export async function awardCoins(
  volunteerId: string,
  amount: number,
  type: TransactionType,
  referenceId?: string,
  description?: string
) {
  const volunteer = await prisma.volunteer.findUnique({ where: { id: volunteerId } })
  if (!volunteer) throw new Error('Volunteer not found')

  const newBalance = volunteer.totalCoins + amount

  await prisma.$transaction([
    prisma.coinTransaction.create({
      data: {
        volunteerId,
        amount,
        transactionType: type,
        referenceId,
        description: description ?? `Earned ${amount} coins for ${type}`,
        balanceAfter: newBalance,
      },
    }),
    prisma.volunteer.update({
      where: { id: volunteerId },
      data: { totalCoins: newBalance },
    }),
    prisma.leaderboardCache.upsert({
      where: { volunteerId },
      update: { totalCoins: newBalance },
      create: {
        volunteerId,
        name: volunteer.name,
        district: volunteer.district ?? '',
        state: volunteer.state ?? '',
        totalCoins: newBalance,
        totalScans: volunteer.totalScans,
        avgRating: volunteer.avgRating,
      },
    }),
  ])

  return newBalance
}

export { COIN_RULES }
