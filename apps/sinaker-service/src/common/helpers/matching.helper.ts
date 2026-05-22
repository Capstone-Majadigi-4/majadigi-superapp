export class MatchingHelper {
  static calculateMatchingScore(
    userSkills: string[],
    requiredSkills: string[],
  ): number {
    if (
      !userSkills?.length ||
      !requiredSkills?.length
    ) {
      return 0;
    }

    const normalizedUserSkills =
      userSkills.map((skill) =>
        skill.toLowerCase().trim(),
      );

    const normalizedRequiredSkills =
      requiredSkills.map((skill) =>
        skill.toLowerCase().trim(),
      );

    let matched = 0;

    for (const skill of normalizedRequiredSkills) {
      if (
        normalizedUserSkills.includes(
          skill,
        )
      ) {
        matched++;
      }
    }

    const percentage =
      (
        matched /
        normalizedRequiredSkills.length
      ) * 100;

    return Math.round(
      percentage,
    );
  }
}