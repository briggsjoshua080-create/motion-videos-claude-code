import { Config } from "@remotion/cli/config";

// Studio / render defaults. Per-video size, fps and duration live in src/config.ts.
Config.setVideoImageFormat("jpeg");
Config.setCodec("h264");
Config.setOverwriteOutput(true);
Config.setConcurrency(null); // null = auto (half of CPU cores)
