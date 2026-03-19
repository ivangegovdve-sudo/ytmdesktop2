import definePlugin from "@plugins/utils";

export default definePlugin(
	"internal:track-change-watcher",
	{
		enabled: true,
		displayName: "Track Change Watcher",
	},
	({ domUtils }) => {
		async function handleThumbnail(_ev, value: string) {
			if (value) {
				document.documentElement.style.setProperty('--ytmd-thumbnail-url', value);
			} else {
				document.documentElement.style.removeProperty('--ytmd-thumbnail-url');
			}
		}
		async function handleAccent(_ev, value: string) {
			if (value) {
				document.documentElement.style.setProperty('--ytmd-thumbnail-accent', value);
			} else {
				document.documentElement.style.removeProperty('--ytmd-thumbnail-accent');
			}
		}
		domUtils.ensureDomLoaded(async () => {
			await domUtils.createStyle(`
				#progress-bar.ytmusic-player-bar {
					--paper-slider-active-color: var(--ytmd-thumbnail-accent) !important;
					--paper-slider-knob-color: var(--ytmd-thumbnail-accent) !important;
				}
				ytmusic-player-bar {
					--ytmusic-player-bar-background: var(--ytmd-thumbnail-accent) !important;
				}
			`);
			window.ipcRenderer.on("css.thumbnail", handleThumbnail);
			window.ipcRenderer.on("css.thumbnail-accent", handleAccent);
		});
	},
);
