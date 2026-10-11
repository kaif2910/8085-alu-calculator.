# Littlebit — 8085 Calculator

Visual theme: flat frosted glass controls over an animated 8085 circuit background. `dist/glass.css` defines the theme; `dist/background.js` adds decorative SVG data pulses and arithmetic equations. The background is conceptual artwork, not an execution trace. Use Pause motion to stop it; device reduced-motion preferences disable animation automatically. No external assets or dependencies are required.

Compact layout update: the main calculator fits its panel to the available viewport height with an adaptive keypad, mobile styling and a landscape layout. Type or paste numbers directly into the single display, or use the keypad. Examples are now selected from a dropdown and run with Try. Flags and assembly open in a dialog. Extremely short viewports, high accessibility zoom and the on-screen keyboard may still require scrolling so controls remain accessible.

Latest interface: one shared answer display in a single panel. Calculator and Number converter tabs sit above visible source format and word-size controls. All operations are visible beside the keypad. Converter mode adds a target-format selector and changes Equals to Convert. Only the main display shows the selected answer; changing the target format updates a completed conversion.

Fourteen clickable examples cover addition, subtraction, incoming/outgoing carry and borrow, 16-bit addition, ABS, AND, OR, XOR, NOT, and decimal-to-binary/hex conversion. Each displays PASS or FAIL against fixed expected values; “Check all examples” runs all checks without altering the current calculation. `dist/examples.js` contains these examples and their checks.

The interface uses a traditional calculator keypad with plain-language labels: enter a number, choose Add or Subtract, enter the next number, then press Equals. Decimal is the default. Use Clear all to start again, Delete to correct a digit, and Change sign to change the signed value. The message below the display explains the next step and any result that wraps. The Help button opens instructions. Keyboard support: number keys, +, -, = or Enter, Backspace, and Escape.

Number size, number format, AND, OR, XOR, NOT and incoming carry/borrow are visible in the main panel. Hex mode adds A–F keys; binary mode disables digits other than 0 and 1. Open “See how the 8085 gets there” for flags, assembly and an explanation. “Make positive” (ABS) uses the signed interpretation of the word. Multiplication, division and fractions are outside this project's 8085 ALU scope.

Open `dist/index.html` in a browser. No build tools or installation needed. HTML, CSS, and plain JavaScript; no backend, external fonts or network dependencies.

Supports 8- and 16-bit ADD, ADC, SUB, SBB, ABS, AND, OR, XOR, and complement; binary/hex/decimal input; signed decimal inputs; binary result visualization; flags; and equivalent 8085 assembly routines. ABS operates on a signed two's-complement input. Arithmetic wraps to the selected width.

`dist/engine.js` holds the pure arithmetic engine, `dist/calculator.js` manages keypad state, `dist/app.js` connects the UI, and `dist/style.css` supplies the responsive layout. This is an educational ALU calculator, not a complete assembler or cycle-accurate CPU emulator. Assembly is generated for the selected calculation, not executed from an editable program.

Flag semantics: subtraction CY indicates borrow; AC is internal nibble carry (complement of nibble borrow). DAD updates only CY. CMA preserves all flags. Unchanged flags are displayed as a dash because each calculation is independent. For 16-bit byte routines, flags are those of the last high-byte ALU operation, so Z is not a whole-word zero test. ABS at the minimum signed value gives an unsigned magnitude and an explicit signed-range warning.

Reference: Intel 8080/8085 Assembly Language Programming Manual, May 1981: https://bitsavers.trailing-edge.com/components/intel/MCS80/9800301D_8080_8085_Assembly_Language_Programming_Manual_May81.pdf
