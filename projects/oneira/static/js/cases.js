/* Cases shown on the page. The files under assets/ mirror supp_videos/assets, and
   docs/tools/build_project_page_assets.py copies every path named here and makes its poster.

   Each 10 s segment has 8 chunks. k is the 1-based chunk over the whole chain whose caption carries
   the interaction. The event chunks come from the conditioning video, where the box of an object
   starts to change colour in the chunk whose caption carries the interaction. */
const CASES = [
  {
    block: "long", id: "lh1", tab: "Campfire and apple",
    title: "Campfire and apple, 30 s chain of three segments",
    desc: "A hand puts out the campfire with frost and later gilds the apple. The camera then turns back to the fire and walks up to it.",
    check: "The fire should stay out and the apple should stay gold after the camera turns back.",
    first: "assets/long_horizon/case_1/first_frame.jpg",
    cond: "assets/long_horizon/case_1/reference_cond__chain30s.mp4",
    segments: 3,
    events: [
      { k: 7, text: "A hand casts a jet of frost at the campfire. The fire on a campfire is put out by frost and it ends up dark and crusted with ice." },
      { k: 14, text: "A hand casts a gilding spell at the apple. The apple turns into solid gold and stays gold." },
    ],
    videos: [
      { src: "assets/long_horizon/case_1/ours_v3ep13__chain30s.mp4", label: "Oneira (ours)", ours: true },
      { src: "assets/long_horizon/case_1/base_ref2va_mem__chain30s.mp4", label: "MiniMax-H3 Ref2VA" },
      { src: "assets/long_horizon/case_1/lingbot_world_v2__chain30s.mp4", label: "LingBot-World-V2" },
      { src: "assets/long_horizon/case_1/yume_1_5__chain30s.mp4", label: "YUME 1.5" },
    ],
  },
  {
    block: "long", id: "lh2", tab: "Blue toolbox",
    title: "Blue toolbox, 20 s chain of two segments",
    desc: "A hand opens the blue steel toolbox on the workbench. The camera leaves the bench and later comes back to it.",
    check: "The toolbox should still be open when it comes back into view.",
    first: "assets/long_horizon/case_2/first_frame.jpg",
    cond: "assets/long_horizon/case_2/cond_video.mp4",
    segments: 2,
    events: [
      { k: 3, text: "A hand opens the blue steel toolbox. The blue steel toolbox ends up fully open and stays open." },
    ],
    videos: [
      { src: "assets/long_horizon/case_2/ours.mp4", label: "Oneira (ours)", ours: true },
      { src: "assets/long_horizon/case_2/h3_ref2va.mp4", label: "MiniMax-H3 Ref2VA" },
      { src: "assets/long_horizon/case_2/lingbotworldv2.mp4", label: "LingBot-World-V2" },
      { src: "assets/long_horizon/case_2/yume.mp4", label: "YUME 1.5" },
      { src: "assets/long_horizon/case_2/alaya_world.mp4", label: "AlayaWorld" },
    ],
  },
  {
    block: "long", id: "lh3", tab: "Wooden horse",
    title: "Wooden horse, 20 s chain of two segments",
    desc: "A hand casts frost at the wooden toy horse on the workbench. The camera walks toward the door and then turns back to the bench.",
    check: "The horse should stay frozen when the camera returns.",
    first: "assets/long_horizon/case_3/first_frame.jpg",
    cond: "assets/long_horizon/case_3/cond_video.mp4",
    segments: 2,
    events: [
      { k: 3, text: "A hand casts a jet of frost at the wooden toy horse. The wooden toy horse is frozen over and stays frozen." },
    ],
    videos: [
      { src: "assets/long_horizon/case_3/ours.mp4", label: "Oneira (ours)", ours: true },
      { src: "assets/long_horizon/case_3/H3_ref2va.mp4", label: "MiniMax-H3 Ref2VA" },
      { src: "assets/long_horizon/case_3/lingbot_wolrdv2.mp4", label: "LingBot-World-V2" },
      { src: "assets/long_horizon/case_3/yume.mp4", label: "YUME 1.5" },
      { src: "assets/long_horizon/case_3/alaya_world.mp4", label: "AlayaWorld" },
    ],
  },
  {
    block: "long", id: "lh4", tab: "Ceramic mug",
    title: "Ceramic mug, 20 s chain of two segments",
    desc: "A hand swings a hammer down onto the ceramic mug on the kitchen counter. The camera walks to the open door and then returns to the counter.",
    check: "The shards should stay on the counter where the mug broke.",
    first: "assets/long_horizon/case_4/first_frame.jpg",
    cond: "assets/long_horizon/case_4/cond_video.mp4",
    segments: 2,
    events: [
      { k: 3, text: "A hand swings a hammer down onto the ceramic mug. The ceramic mug is smashed with a hammer and stays broken." },
    ],
    videos: [
      { src: "assets/long_horizon/case_4/ours.mp4", label: "Oneira (ours)", ours: true },
      { src: "assets/long_horizon/case_4/H3_ref2va.mp4", label: "MiniMax-H3 Ref2VA" },
      { src: "assets/long_horizon/case_4/lingbot_worldv2.mp4", label: "LingBot-World-V2" },
      { src: "assets/long_horizon/case_4/yume.mp4", label: "YUME 1.5" },
      { src: "assets/long_horizon/case_4/alaya_world.mp4", label: "AlayaWorld" },
    ],
  },
  {
    block: "long", id: "lh5", tab: "Clay pot",
    title: "Clay pot, 20 s chain of two segments",
    desc: "A hand casts a gilding spell at the clay pot on the table. The camera looks away to the far side of the room and then comes back.",
    check: "The pot should stay gold when the camera comes back.",
    first: "assets/long_horizon/case_5/first_frame.jpg",
    cond: "assets/long_horizon/case_5/cond_video.mp4",
    segments: 2,
    events: [
      { k: 4, text: "A hand casts a gilding spell at the clay pot. The clay pot turns into solid gold and stays gold." },
    ],
    videos: [
      { src: "assets/long_horizon/case_5/ours.mp4", label: "Oneira (ours)", ours: true },
      { src: "assets/long_horizon/case_5/H3_ref2va.mp4", label: "MiniMax-H3 Ref2VA" },
      { src: "assets/long_horizon/case_5/lingbot_worldv2.mp4", label: "LingBot-World-V2" },
      { src: "assets/long_horizon/case_5/yume.mp4", label: "YUME 1.5" },
      { src: "assets/long_horizon/case_5/alaya_world.mp4", label: "AlayaWorld" },
    ],
  },
  {
    block: "multi", id: "mo1", tab: "Plants and toolboxes",
    title: "Potted plants and toolboxes, 10 s",
    desc: "Three identical potted plants stand next to three identical wooden toolboxes. The captions name each target by its place in its row.",
    check: "Only the middle plant should turn gold and only the right toolbox should freeze.",
    first: "assets/multiobj/case1/first_frame.jpg",
    cond: "assets/multiobj/case1/cond_video.mp4",
    segments: 1,
    events: [
      { k: 3, text: "A hand casts a gilding spell at the middle potted plant. The middle potted plant turns into solid gold and stays gold." },
      { k: 5, text: "A hand casts a jet of frost at the right wooden toolbox. The right wooden toolbox is coated in white frost and ice and stays frozen over." },
    ],
    videos: [
      { src: "assets/multiobj/case1/ours.mp4", label: "Oneira (ours)", ours: true },
      { src: "assets/multiobj/case1/h3_ref2va.mp4", label: "MiniMax-H3 Ref2VA" },
      { src: "assets/multiobj/case1/lingbot_world_v2.mp4", label: "LingBot-World-V2" },
      { src: "assets/multiobj/case1/yume.mp4", label: "YUME 1.5" },
      { src: "assets/multiobj/case1/alaya_world.mp4", label: "AlayaWorld" },
    ],
  },
  {
    block: "multi", id: "mo2", tab: "Helmets and birdbaths",
    title: "Iron helmets and birdbaths, 10 s",
    desc: "Three identical iron helmets stand next to three identical stone birdbaths full of water. The captions name each target by its place in its row.",
    check: "Only the middle helmet should turn gold and only the right birdbath should freeze.",
    first: "assets/multiobj/case2/first_frame.jpg",
    cond: "assets/multiobj/case2/cond_video.mp4",
    segments: 1,
    events: [
      { k: 4, text: "A hand casts a gilding spell at the middle iron helmet. The middle iron helmet turns into solid gold and stays gold." },
      { k: 7, text: "A hand casts a jet of frost at the right stone birdbath full of water. The right stone birdbath full of water is coated in white frost and ice and stays frozen over." },
    ],
    videos: [
      { src: "assets/multiobj/case2/ours.mp4", label: "Oneira (ours)", ours: true },
      { src: "assets/multiobj/case2/h3_ref2va.mp4", label: "MiniMax-H3 Ref2VA" },
      { src: "assets/multiobj/case2/lingbot_world_v2.mp4", label: "LingBot-World-V2" },
      { src: "assets/multiobj/case2/yume.mp4", label: "YUME 1.5" },
      { src: "assets/multiobj/case2/alaya_world.mp4", label: "AlayaWorld" },
    ],
  },
  {
    block: "multi", id: "mo3", tab: "Plaster busts",
    title: "Plaster busts, 10 s",
    desc: "Five identical plaster busts stand in a row in the corridor. The caption names the target by its place in the row.",
    check: "Only the fourth bust from the left should shatter, and its pieces should stay on the floor.",
    first: "assets/multiobj/case3/first_frame.jpg",
    cond: "assets/multiobj/case3/cond_video.mp4",
    segments: 1,
    events: [
      { k: 7, text: "A hand smashes the fourth plaster bust from the left with a hammer. The fourth plaster bust from the left is shattered into pieces and the pieces stay scattered." },
    ],
    videos: [
      { src: "assets/multiobj/case3/ours.mp4", label: "Oneira (ours)", ours: true },
      { src: "assets/multiobj/case3/h3_ref2va.mp4", label: "MiniMax-H3 Ref2VA" },
      { src: "assets/multiobj/case3/lingbotworld_v2.mp4", label: "LingBot-World-V2" },
      { src: "assets/multiobj/case3/yume.mp4", label: "YUME 1.5" },
      { src: "assets/multiobj/case3/alaya_world.mp4", label: "AlayaWorld" },
    ],
  },
  {
    block: "multi", id: "mo4", tab: "Straw hats",
    title: "Straw hats, 10 s",
    desc: "Five identical straw hats lie on a bench in the yard. The caption names the target by its place in the row.",
    check: "Only the second hat from the left should leave the bench and stay in the hand.",
    first: "assets/multiobj/case4/first_frame.jpg",
    cond: "assets/multiobj/case4/cond_video.mp4",
    segments: 1,
    events: [
      { k: 7, text: "A hand picks up the second straw hat from the left. The second straw hat from the left is lifted off the surface and carried." },
    ],
    videos: [
      { src: "assets/multiobj/case4/ours.mp4", label: "Oneira (ours)", ours: true },
      { src: "assets/multiobj/case4/h3_ref2va.mp4", label: "MiniMax-H3 Ref2VA" },
      { src: "assets/multiobj/case4/lingbot_worldv2.mp4", label: "LingBot-World-V2" },
      { src: "assets/multiobj/case4/yume.mp4", label: "YUME 1.5" },
      { src: "assets/multiobj/case4/alaya_world.mp4", label: "AlayaWorld" },
    ],
  },
  {
    block: "unseen", id: "un1", tab: "Blue vase",
    title: "Blue vase, 20 s chain of two segments",
    desc: "The camera walks through the gallery and turns the corner, where a blue ceramic vase comes into view. In the second segment a hand shoots the vase.",
    check: "The vase should shatter when the hand fires at it.",
    first: "assets/unseen_obj/case_1/first_frame.jpg",
    cond: "assets/unseen_obj/case_1/cond_video.mp4",
    segments: 2, segFrames: 240,
    events: [
      { k: 13, text: "A hand aims a pistol at the blue ceramic vase and fires once. The fragile object shatters into scattered fragments." },
    ],
    videos: [
      { src: "assets/unseen_obj/case_1/ours.mp4", label: "Oneira (ours)", ours: true },
    ],
  },
  {
    block: "unseen", id: "un2", tab: "Stone sphere",
    title: "Carved stone sphere, 20 s chain of two segments",
    desc: "The camera walks out of the workshop, where a carved stone sphere comes into view on the terrace. In the second segment a hand gilds the sphere.",
    check: "The sphere should turn gold and stay gold.",
    first: "assets/unseen_obj/case_2/first_frame.jpg",
    cond: "assets/unseen_obj/case_2/cond_video.mp4",
    segments: 2, segFrames: 240,
    events: [
      { k: 13, text: "A hand casts a gilding spell at the carved stone sphere. Its material turns to solid shiny gold and remains gold." },
    ],
    videos: [
      { src: "assets/unseen_obj/case_2/ours.mp4", label: "Oneira (ours)", ours: true },
    ],
  },
  {
    block: "unseen", id: "un3", tab: "Sensor sphere",
    title: "Metallic sensor sphere, 20 s chain of two segments",
    desc: "The camera walks along the laboratory and turns the corner, where a metallic sensor sphere comes into view. In the second segment a hand casts frost at the sphere.",
    check: "A layer of ice should cover the sphere and stay on it.",
    first: "assets/unseen_obj/case_3/first_frame.jpg",
    cond: "assets/unseen_obj/case_3/cond_video.mp4",
    segments: 2, segFrames: 240,
    events: [
      { k: 13, text: "A hand casts a jet of frost at the metallic sensor sphere. A visible layer of ice coats it and persists afterward." },
    ],
    videos: [
      { src: "assets/unseen_obj/case_3/ours.mp4", label: "Oneira (ours)", ours: true },
    ],
  },
  {
    block: "more", id: "mc1", tab: "Fire extinguisher",
    title: "Fire extinguisher, 10 s",
    desc: "The camera walks into the hotel room toward the burning plastic recycling bin. A hand takes the fire extinguisher off its mount and sprays the bin.",
    check: "The extinguisher should stay in the hand, and the fire in the bin should go out after the spray.",
    first: "assets/more_case/case_1/first_frame.jpg",
    cond: "assets/more_case/case_1/cond_video.mp4",
    segments: 1,
    events: [
      { k: 4, text: "A hand takes the fire extinguisher off its mount. The fire extinguisher is off its mount and held in the hand." },
      { k: 6, text: "A hand sprays the fire extinguisher at the plastic recycling bin. The fire in a plastic recycling bin is put out and only thin smoke remains." },
    ],
    videos: [
      { src: "assets/more_case/case_1/ours.mp4", label: "Oneira (ours)", ours: true },
    ],
  },
  {
    block: "more", id: "mc2", tab: "Iron kettle",
    title: "Iron kettle, 10 s",
    desc: "The camera walks through the kitchen to the table with the iron kettle. A hand casts an invisibility spell at the kettle.",
    check: "The kettle should fade away and stay invisible, while its box stays in the conditioning video with a new colour.",
    first: "assets/more_case/case_2/first_frame.jpg",
    cond: "assets/more_case/case_2/cond_video.mp4",
    segments: 1,
    events: [
      { k: 7, text: "A hand casts an invisibility spell at the iron kettle. The iron kettle fades away until it is invisible, and stays invisible." },
    ],
    videos: [
      { src: "assets/more_case/case_2/ours.mp4", label: "Oneira (ours)", ours: true },
    ],
  },
  {
    block: "more", id: "mc3", tab: "Torch",
    title: "Torch, 10 s",
    desc: "A hand casts fire at the unlit torch on the wall of the mine tunnel. Later the same hand casts frost at the burning torch.",
    check: "The torch should catch fire first and then freeze over.",
    first: "assets/more_case/case_3/first_frame.jpg",
    cond: "assets/more_case/case_3/cond_video.mp4",
    segments: 1,
    events: [
      { k: 3, text: "A hand casts a jet of fire at the unlit torch. The unlit torch catches fire and burns steadily." },
      { k: 6, text: "A hand casts a jet of frost at the unlit torch. The unlit torch is frozen over and stays frozen." },
    ],
    videos: [
      { src: "assets/more_case/case_3/ours.mp4", label: "Oneira (ours)", ours: true },
    ],
  },
  {
    block: "more", id: "mc4", tab: "Burning stool",
    title: "Burning stool, 10 s",
    desc: "The camera walks through the study to the burning wooden stool. A hand casts frost at the stool.",
    check: "The fire should go out and the stool should stay crusted with ice.",
    first: "assets/more_case/case_4/first_frame.jpg",
    cond: "assets/more_case/case_4/cond_video.mp4",
    segments: 1,
    events: [
      { k: 4, text: "A hand casts a jet of frost at the wooden stool. The fire on a wooden stool is put out by frost and it ends up dark and crusted with ice." },
    ],
    videos: [
      { src: "assets/more_case/case_4/ours.mp4", label: "Oneira (ours)", ours: true },
    ],
  },
];

/* Result sections in page order. The first two compare with the baselines. */
const BLOCKS = [
  {
    id: "long", title: "Long-horizon consistency",
    lead: "Each chain joins segments of about 10 seconds. The camera leaves an object after an interaction and later returns to it, so each chain tests whether the changed state persists.",
  },
  {
    id: "multi", title: "Interaction with identical objects",
    lead: "Each scene holds a row of identical copies of an object, and some scenes hold two such rows. The captions name each target by its place in the row, so every interaction has to hit the named copy and leave its neighbours unchanged.",
  },
  {
    id: "unseen", title: "Interaction with unseen objects",
    lead: "The target object is absent from the first frame. The video model generates it in the first segment while the camera explores, and the coding agent adds it to the world state table before the second segment. Its box therefore appears in the conditioning video only from the second segment on, where a hand interacts with it.",
  },
  {
    id: "more", title: "More results of Oneira",
    lead: "The engine renders the conditioning video from the world state table, and each box in it stands for one object. The colour of a box changes when the state of its object changes.",
  },
];
