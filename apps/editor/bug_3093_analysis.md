/**
 * Bug #3093 Analysis: toMdNodeTypeWriters.ts - paragraph() converter
 * 
 * Current Logic for Empty Paragraphs:
 * 
 * Given 5 empty paragraphs: <p><br></p><p><br></p><p><br></p><p><br></p><p><br></p>
 * 
 * Processing:
 * 1. Para[0]: firstChildNode=true, emptyNode=true, prevEmptyNode=false
 *    → Goes to line 85-94
 *    → Skips parent type check (parent is 'doc' not 'listItem')
 *    → Writes only '\n'  ❌ (should write '<br>')
 * 
 * 2. Para[1]: emptyNode=true, prevEmptyNode=true (Para[0] is empty)
 *    → Goes to line 83-84
 *    → Writes '<br>\n'  ✅
 * 
 * 3. Para[2]: emptyNode=true, prevEmptyNode=true (Para[1] is empty)
 *    → Writes '<br>\n'  ✅
 * 
 * 4. Para[3]: emptyNode=true, prevEmptyNode=true
 *    → Writes '<br>\n'  ✅
 * 
 * 5. Para[4]: emptyNode=true, prevEmptyNode=true
 *    → Writes '<br>\n'  ✅
 * 
 * Result: Only 4 <br> tags instead of 5!
 * 
 * The BUG: Line 85's condition `emptyNode && !prevEmptyNode && !firstChildNode`
 * This means the FIRST empty paragraph gets skipped!
 * 
 * FIX: The first empty paragraph should ALSO write '<br>' not just '\n'
 */
