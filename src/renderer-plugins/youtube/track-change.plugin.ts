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
			window.ipcRenderer.on("css.thumbnail", handleThumbnail);
			window.ipcRenderer.on("css.thumbnail-accent", handleAccent);

			// Inject actual CSS using this variable to correctly style the UI components responding to track changes
			await domUtils.createStyle(`
				ytmusic-player-page:not([is-mweb-modernization-enabled]) .content.ytmusic-player-page:before,
				ytmusic-player-page[is-mweb-modernization-enabled] .content.ytmusic-player-page:before {
					content: "";
					background-image: var(--ytmd-thumbnail-url);
					background-size: cover;
					background-position: center;
					background-repeat: no-repeat;
					background-color: var(--ytmd-thumbnail-accent);
					backdrop-filter: blur(10px);
					-webkit-backdrop-filter: blur(10px);
					filter: saturate(120%) brightness(1.15) opacity(0.33) blur(16px);
					mix-blend-mode: exclusion;
					border-radius: 8px;
					overflow: hidden;
					transform: translate3d(0, 0, 1px) scale(1.1);
					position: absolute;
					top: -12px;
					left: calc(var(--ytmusic-guide-width) * -1);
					right: calc(var(--ytmusic-guide-width) * -1);
					bottom: -20px;
					z-index: -1;
					transition: background-image 0.5s ease-in-out, background-color 0.5s ease-in-out;
				}
			`);
		});
	},
);
