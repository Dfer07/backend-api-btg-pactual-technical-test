export class Fund {
  constructor(
    public readonly fundId: string,
    public readonly name: string,
    public readonly minimumAmount: number,
    public readonly category: string,
    public readonly createdAt: string,
  ) {}
}
