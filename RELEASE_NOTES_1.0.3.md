# YUMY Ocean 1.0.3

## Fixes
- Fixed ambient whales, orcas, and turtles being carried along with camera movement. They now move independently in world coordinates; camera scrolling changes only the viewport.
- Preserved ambient swim animation and rare spawn behavior.

## Validation
- JavaScript syntax check passed.
- Verified that ambient creature updates no longer add camera deltas to creature world positions.
- ZIP integrity checked after packaging.
