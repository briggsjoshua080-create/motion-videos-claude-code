// The Belgian reference look needs three more fonts than the bundled Inter: a heavy grotesque for
// headlines, an italic serif for the one-line asides and a mono for the broadcast labels. They are
// bundled from npm (@fontsource) so renders never fetch fonts over the network.
import "@fontsource/archivo-black/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";
import { continueRender, delayRender } from "remotion";

// Browsers only fetch a web font once text uses it, which can be mid-scene; load all of them up
// front and hold the render until they are ready, so no frame is drawn with a fallback font.
const FACES = ['400 100px "Archivo Black"', 'italic 400 100px "Instrument Serif"', '400 100px "JetBrains Mono"', '700 100px "JetBrains Mono"'];

if (typeof document !== "undefined") {
  const handle = delayRender("Loading the Swedish video's fonts");
  Promise.all(FACES.map((face) => document.fonts.load(face)))
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
}
