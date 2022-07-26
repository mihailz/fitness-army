import {BodyStatsInfo} from "./body-stats-info";
import {BodyMassIndexStats} from "./body-mass-index-stats";
import {BodyFatPercentage} from "./body-fat-percentage";

export class UserBodyStats {
  bodyStats: BodyStatsInfo;
  bodyMassIndex?: BodyMassIndexStats;
  bodyFatPercentage?: BodyFatPercentage;

  constructor(bodyStats: BodyStatsInfo, bodyMassIndex?: BodyMassIndexStats, bodyFatPercentage?: BodyFatPercentage) {
    this.bodyStats = bodyStats;
    this.bodyMassIndex = bodyMassIndex;
    this.bodyFatPercentage = bodyFatPercentage;
  }
}
