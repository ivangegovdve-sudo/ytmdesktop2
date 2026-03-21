import { BaseEvent, OnEventExecute } from "@main/utils/baseEvent";

export default class TrackInfoChange extends BaseEvent implements OnEventExecute {
  constructor() {
    super("track:change");
  }
  execute() {}
}
