import {BodyStatsInfo} from "./body-stats-info";
import {BodyMassIndexStats} from "./body-mass-index-stats";
import {BodyFatPercentage} from "./body-fat-percentage";
import {IdealBodyWeight} from "./ideal-body-weight";

export class UserBodyStats {
  bodyStats: BodyStatsInfo;
  bodyMassIndex: BodyMassIndexStats;
  bodyFatPercentage: BodyFatPercentage;
  idealBodyWeight: IdealBodyWeight;

  constructor(bodyStats: BodyStatsInfo,
              bodyMassIndex: BodyMassIndexStats,
              bodyFatPercentage: BodyFatPercentage,
              idealBodyWeight: IdealBodyWeight) {
    this.bodyStats = bodyStats;
    this.bodyMassIndex = bodyMassIndex;
    this.bodyFatPercentage = bodyFatPercentage;
    this.idealBodyWeight = idealBodyWeight;
  }
}
