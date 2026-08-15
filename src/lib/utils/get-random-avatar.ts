import { avatarKeys, AvatarKey } from "@/lib/constants/avatars";

/**
 * Returns a randomly selected AvatarKey from the list of available avatars.
 */
export function getRandomAvatar(): AvatarKey {
  const randomIndex = Math.floor(Math.random() * avatarKeys.length);
  return avatarKeys[randomIndex];
}
