import definePlugin from "@plugins/utils";

export default definePlugin(
	"internal:track-change-watcher",
	{
		enabled: true,
		displayName: "Track Change Watcher",
	},
	({ domUtils }) => {
		function handleThumbnail(_ev, value: string) {
			document.documentElement.style.setProperty("--ytmd-thumbnail-url", value || "none");
		}
		function handleAccent(_ev, value: string) {
			document.documentElement.style.setProperty("--ytmd-thumbnail-accent", value || "transparent");
		}
		domUtils.ensureDomLoaded(() => {
			window.ipcRenderer.on("css.thumbnail", handleThumbnail);
			window.ipcRenderer.on("css.thumbnail-accent", handleAccent);
		});
	},
);
