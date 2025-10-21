import { useState, useRef, useMemo } from "react";



function clean(element) {
    requestAnimationFrame(() => {
        element.current.forEach((eachSpan) => {
            eachSpan.style.backgroundColor = "white";
        });
    });
}

let currentFindMode = undefined;
const defaultText = `akakashakashaKashAKashakAkash12AKaKash34akAKash56kaAkash78aKakAsh90akAkaShakAkashakA12kA34shAK56ash78akAK90ash12akA34kAsh56aK78ash90akA12kAsh34ak56ash78akA90kAsh12ak34ash56ak78Ash90akA12kAsh34ak56ash78aK90kAsh12ak34aKashash56ak78Ash90`;
const defaultSplited = defaultText.split("");



/**
 * Pattern Matching Visualizer
 * 
 * @author Akash V
 * @contact akashv2000.dev@gmail.com
 * @Date 19-10-2025
 *
 * Built To Visualizing Pattern Matching in JavaScript with Algorithms .
 */
export default function PatternVirtualization() {
    const [query, setQuery] = useState("aKash");
    const [mode, setMode] = useState("sequential");
    const [text, setText] = useState(defaultText);
    const [buttonEvent, setButtonEvent] = useState({ editing: false, startedVisualizing: false });
    const [splitedText, setSplitedText] = useState(defaultSplited);
    const state = useRef({ count: 0, index: 0 });
    const element = useRef([]);
    const countRef = useRef(undefined);



    //console.log('splitedText', splitedText);
    const memoized = useMemo(() => {
        return splitedText.map((char, index) => (
            <span
                key={index}
                ref={(ref) => (element.current[index] = ref)}
                className="char-square"
                style={{ backgroundColor: "white" }}
            >
                {char}
            </span>
        ));
    }, [splitedText]);




    const startVisual = () => {
        setButtonEvent((data) => ({ ...data, startedVisualizing: true }));
        /**
         * cleaning and setting default values
         */
        countRef.current.textContent = 0;
        state.current.count = 0;
        state.current.paragraphIndex = mode === 'SCS' ? query.length - 1 : 0;
        state.current.length = splitedText.length;
        state.current.queryIndex = 0;
        state.current.queryLength = query.length;
        state.current.matched = 0;
        currentFindMode = mode === 'SCS' ? scsAlgorithm : sequencialPatternMaching;
        const storage = {};
        query.split("").forEach((char, index) => {
            storage[char] = index;
        })
        state.current.charIndex = storage;
        state.current.isPrevLokup = false;

        clean(element);
        /**
         * cleaning End
         */
        requestAnimationFrame(currentFindMode);
    };

    const sequencialPatternMaching = () => {
        let mached = false;
        let countMached = 0;
        if (state.current.paragraphIndex < state.current.length) {
            if (
                splitedText[state.current.paragraphIndex] ===
                query[state.current.queryIndex]
            ) {
                state.current.matched++;
                state.current.queryIndex++;
                if (state.current.matched === state.current.queryLength) {
                    mached = true;
                    state.current.matched = 0;
                    state.current.queryIndex = 0;
                    state.current.count++;
                    countRef.current.textContent = state.current.count;
                }
            } else {
                countMached = state.current.matched;
                state.current.matched = 0;
                state.current.queryIndex = 0;
            }

            if (mached) {
                let i = 0;
                let position = state.current.paragraphIndex;
                while (i < state.current.queryLength) {
                    element.current[position].style.backgroundColor = "#8BC34A";
                    i++;
                    position--;
                }
            } else {
                element.current[state.current.paragraphIndex].style.backgroundColor =
                    "#EF5350";
            }


            if (countMached) {
                // fixedd not cheking overlap
                state.current.paragraphIndex -= (countMached - 1);
                countMached = 0;
            } else {
                state.current.paragraphIndex += 1;
            }
            requestAnimationFrame(currentFindMode);
        } else {
            setButtonEvent((data) => ({ ...data, startedVisualizing: false }));
        }
    };


    const scsAlgorithm = () => {
        let mached = false;
        let indexBeforeJump = 0;
        //debugger;
        if (state.current.paragraphIndex < state.current.length) {
            if (state.current.isPrevLokup) {
                if (
                    splitedText[state.current.paragraphIndex] ===
                    query[state.current.queryIndex]
                ) {
                    state.current.matched++;
                    state.current.queryIndex++;
                    if (state.current.matched === state.current.queryLength) {
                        mached = true;
                        state.current.matched = 0;
                        state.current.queryIndex = 0;
                        state.current.count++;
                        countRef.current.textContent = state.current.count;

                        indexBeforeJump = state.current.paragraphIndex;
                        state.current.paragraphIndex += state.current.queryLength;
                        state.current.isPrevLokup = false;
                    } else {
                        indexBeforeJump = state.current.paragraphIndex;
                        state.current.paragraphIndex += 1;
                    }

                } else {
                    state.current.matched = 0;
                    state.current.queryIndex = 0;
                    indexBeforeJump = state.current.paragraphIndex;
                    state.current.paragraphIndex += state.current.queryLength;
                    state.current.isPrevLokup = false;
                }
            } else {

                const characterPositon = state.current.charIndex[splitedText[state.current.paragraphIndex]];
                if (characterPositon === undefined) {
                    indexBeforeJump = state.current.paragraphIndex;
                    state.current.paragraphIndex += state.current.queryLength;
                    state.current.isPrevLokup = false;
                } else {
                    indexBeforeJump = state.current.paragraphIndex;
                    state.current.paragraphIndex -= characterPositon;
                    state.current.isPrevLokup = true;
                }
            }

            if (mached) {
                let i = 0;
                let position = indexBeforeJump;
                while (i < state.current.queryLength) {
                    element.current[position].style.backgroundColor = "#8BC34A";
                    i++;
                    position--;
                }
            } else {
                element.current[indexBeforeJump].style.backgroundColor =
                    "#EF5350";
            }

            requestAnimationFrame(currentFindMode);
        } else {
            setButtonEvent((data) => ({ ...data, startedVisualizing: false }));
        }
    };

    const handleSave = () => {
        setSplitedText(text.split(""));
        element.current = [];
        setButtonEvent((data) => ({ ...data, editing: false }));
    };

    return (
        <div className="page">
            <h1>🔍 Pattern Visualizer</h1>
            <p className="subtitle">
                Watch how different pattern-matching algorithms search for text — step by step.
            </p>






            {/* 🔷 Top Info Area */}
            {mode === 'SCS' ? <div className="header">
                <div className="algo-info">
                    <h2>SCS Algorithm — Skipped Character Search</h2>
                    <div style={{ maxWidth: '100%', fontSize: 14, lineHeight: 1.5 }}>
                        <p style={{ paddingBottom: '10px' }}>
                            <strong>SCS Algorithm a Custom Pattern Search by Akash</strong> — built from scratch to efficiently jump through text,
                            skipping unnecessary checks while automatically handling overlapping matches.
                            Designed specifically for this visualizer to efficiently highlight patterns.
                        </p>

                        <p>
                            <strong>Performance note:</strong> Best-case performance improves with longer queries.
                            The more characters in the search term, the faster the algorithm can skip through text.
                        </p>

                        <div style={{
                            backgroundColor: "#f5f5f5",
                            padding: 8,
                            borderRadius: 6,
                            fontFamily: "monospace",
                            overflowX: "auto",
                            whiteSpace: "nowrap"
                        }}>
                            Example: <code>aKash</code> → <code>aKashaKashaKashaKashaKashaKashaKashaKashaKashaKashaKashaKashaKashaKash</code>
                        </div>
                    </div>
                    <a
                        className="github-link"
                        href="https://github.com/akash-iz/SCSAlgorithm?tab=readme-ov-file"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View code on GitHub
                    </a>
                </div>

            </div> : <div className="algo-info">
                <h2>Sequential Search</h2>
                <p>
                    <strong>Sequential Search</strong> — the foundation of pattern matching. It checks each character one by one,
                    forming the basis of string comparisons (<code>===</code>), input validation, and simple searches.
                    While modern languages optimize these operations internally, mastering this basic technique
                    is key to understanding all search algorithms.
                </p>
            </div>}

            {/* --- Controls --- */}
            <div className="controls">
                <label>
                    Search:
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type text to find..."
                    />
                </label>

                <label>
                    Algorithm Type:
                    <select value={mode} onChange={(e) => setMode(e.target.value)}>
                        <option value="sequential">Sequential</option>
                        <option value="SCS">Skipped Character Search</option>
                    </select>
                </label>

                <button disabled={buttonEvent.editing || buttonEvent.startedVisualizing} onClick={startVisual}>▶ Start Visualization</button>
                {/* --- Legend Section --- */}
                <div className="legend">
                    <div className="legend-item">
                        <span className="legend-box red"></span>
                        <span>Looked & Incorrect</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-box green"></span>
                        <span>Matched (Correct)</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-box white"></span>
                        <span>Not Visited Yet</span>
                    </div>
                    <div className="legend-item found-count">

                        <span className="label">Found:</span>
                        <span ref={countRef} className="count">0</span>
                    </div>
                </div>
            </div>

            {/* --- Editable Paragraph Section --- */}
            <div className="editable">
                <h3>Paragraph:</h3>
                {!buttonEvent.editing ? (
                    <>
                        <button disabled={buttonEvent.startedVisualizing} onClick={() => {
                            setButtonEvent((data) => ({ ...data, editing: true }));
                        }}>✏️ Edit</button>
                        <div className="paragraph">{memoized}</div>
                    </>
                ) : (
                    <>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={4}
                            style={{ width: "100%", marginBottom: "8px" }}
                        />
                        <button onClick={handleSave}>💾 Save</button>
                    </>
                )}
            </div>

            {/* --- Styles --- */}
            <style>{`
      .page{
        font-family: Inter, Roboto, sans-serif;
        padding: 20px;
        max-width: 900px;
        margin: 0 auto;
      }
      h1{ font-size: 22px; margin-bottom: 4px; }
      .subtitle { font-size:14px; color:#555; margin-bottom:16px; }

      .legend {
        display: flex;
        gap: 16px;
        margin-bottom: 20px;
        align-items: center;
        flex-wrap: wrap;
        background: #f9f9f9;
        padding: 10px 14px;
        border-radius: 8px;
        border: 1px solid #eee;
      }
      .legend-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
      }
      .legend-box {
        width: 18px;
        height: 18px;
        border: 1px solid #ccc;
        border-radius: 3px;
      }
      .legend-box.red { background: #EF5350; }
      .legend-box.green { background: #8BC34A; }
      .legend-box.white { background: #fff; }

      .controls {
        display:flex;
        gap:12px;
        align-items:flex-end;
        flex-wrap:wrap;
        margin-bottom:16px;
        padding-bottom:12px;
        border-bottom:1px solid #eee;
      }
      label {
        display:flex;
        flex-direction:column;
        font-size:14px;
        font-weight:500;
        color:#444;
      }
      input, select {
        padding:8px 10px;
        font-size:14px;
        border:1px solid #ccc;
        border-radius:6px;
        margin-top:4px;
        min-width:160px;
      }
      button {
        padding:8px 12px;
        border-radius:6px;
        border:1px solid #ccc;
        background:#f7f7f7;
        cursor:pointer;
        transition: background 0.2s ease, transform 0.1s ease;
      }
      button:hover { background:#eee; transform: translateY(-1px); }
      .paragraph {
        margin-top:16px;
        line-height:1;
        padding:10px;
        border:1px solid #f0f0f0;
        border-radius:8px;
        background:#fafafa;
      }
      .char-square {
        display:inline-block;
        width:28px;
        height:28px;
        border:1px solid #ddd;
        margin:2px;
        text-align:center;
        vertical-align:middle;
        line-height:28px;
        border-radius:4px;
        user-select:none;
        font-family: monospace;
        font-size:18px;
        transition: background-color 180ms ease, transform 80ms ease;
      }
      .editable h3 { margin-bottom: 8px; font-size:16px; }
      textarea {
        font-family: monospace;
        font-size: 15px;
        border:1px solid #ccc;
        border-radius:6px;
        padding:8px;
      }


      .algo-info {
  background: #f9fafb;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 20px 0; /* creates vertical gap above and below */
  font-size: 14px;
  color: #444;
  line-height: 1.5;
}

.algo-info h3 {
  font-size: 15px;
  margin-bottom: 6px;
  color: #222;
}

.algo-info p {
  margin: 4px 0;
}

.legend-item.found-count {
  background: #fff;
  border: 1px solid #ddd;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 500;
  color: #333;
  gap: 8px;
}

.legend-item.found-count .separator {
  color: #999;
}

.legend-item.found-count .label {
  color: #555;
}

.legend-item.found-count .count {
  font-weight: 700;

  padding: 2px 8px;
  border-radius: 4px;
  font-family: monospace;
  min-width: 24px;
  text-align: center;
}
    `}</style>
        </div >
    );
}
