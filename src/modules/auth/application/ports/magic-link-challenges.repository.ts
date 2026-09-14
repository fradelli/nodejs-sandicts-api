import type {
  ConsumeMagicLinkChallengeResult,
  CreateMagicLinkChallengeData,
  MagicLinkChallengeRecord,
} from './magic-link-challenges.repository.types';

const MAGIC_LINK_CHALLENGES_REPOSITORY = Symbol(
  'MAGIC_LINK_CHALLENGES_REPOSITORY',
);

type MagicLinkChallengesRepository = {
  /** Atomically revoke still-valid challenges for this email and create the replacement. */
  revokeActiveChallengesAndCreate(
    data: CreateMagicLinkChallengeData,
    replacedAt: Date,
  ): Promise<MagicLinkChallengeRecord>;
  consumeByTokenHash(
    tokenHash: string,
    consumedAt: Date,
  ): Promise<ConsumeMagicLinkChallengeResult>;
};

export { MAGIC_LINK_CHALLENGES_REPOSITORY };
export type { MagicLinkChallengesRepository };
