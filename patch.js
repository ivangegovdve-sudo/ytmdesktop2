const fs = require('fs');
fs.writeFileSync('src/main/events/trackInfoChange.event.ts', `import { BaseEvent, OnEventExecute } from "@main/utils/baseEvent";
import { TrackData } from "@main/utils/trackData";

// todo: remove nested server event calls
export default class TrackInfoChange extends BaseEvent implements OnEventExecute {
	constructor() {
		super("track:change");
	}
	execute(track: TrackData) {
		const trackProvider = this.getProvider("track");
		trackProvider.pushTrackToViews(track);
	}
}
`);
