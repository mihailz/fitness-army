import {BodyStatsInfoModelDto} from "./body-stats-info.model.dto";
import {BodyMassIndexInfoModelDto} from "./body-mass-index-info.model.dto";
import {BodyFatInfoModelDto} from "./body-fat-info.model.dto";

export class BodyStatsModelDto {
  bodyStatsInfo: BodyStatsInfoModelDto;
  bodyMassIndex: BodyMassIndexInfoModelDto;
  bodyFat: BodyFatInfoModelDto;

  constructor(bodyStatsInfo: BodyStatsInfoModelDto,
      bodyMassIndex: BodyMassIndexInfoModelDto, bodyFat: BodyFatInfoModelDto) {
    this.bodyStatsInfo = bodyStatsInfo;
    this.bodyMassIndex = bodyMassIndex;
    this.bodyFat = bodyFat;
  }
}
