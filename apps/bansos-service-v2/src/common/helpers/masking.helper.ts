export class MaskingHelper {
  static nik(
    nik: string,
  ) {
    if (!nik) {
      return null;
    }

    const first =
      nik.slice(0, 5);

    const last =
      nik.slice(-4);

    return `${first}********${last}`;
  }
}