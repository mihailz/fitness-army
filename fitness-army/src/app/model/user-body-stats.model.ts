import {BodyStatsInfo} from "./body-stats-info";
import {BodyMassIndexStats} from "./body-mass-index-stats";
import {BodyFatPercentage} from "./body-fat-percentage";
import {IdealBodyWeight} from "./ideal-body-weight";

export class UserBodyStats {
  bodyStats: BodyStatsInfo;
  bodyMassIndex?: BodyMassIndexStats;
  bodyFatPercentage?: BodyFatPercentage;
  idealBodyWeight?: IdealBodyWeight;

  constructor(bodyStats: BodyStatsInfo,
              bodyMassIndex?: BodyMassIndexStats,
              bodyFatPercentage?: BodyFatPercentage,
              idealBodyWeight?: IdealBodyWeight) {
    this.bodyStats = bodyStats;
    this.bodyMassIndex =
      new BodyMassIndexStats(bodyMassIndex?.bmi!, bodyMassIndex?.health!, bodyMassIndex?.healthyBmiRange!);
    this.bodyFatPercentage =
      new BodyFatPercentage(bodyFatPercentage?.bodyFatPercentage!,
        bodyFatPercentage?.fatMassWeight!, bodyFatPercentage?.leanMassWeight!);
    this.idealBodyWeight = new IdealBodyWeight(idealBodyWeight?.idealWeight!);
  }
}
