import { useState, useMemo } from "react";

// ============================================================
//  SHARED UTILITIES
// ============================================================
const STOPWORDS = new Set("the and but for its ive was not you your that this with from have just been they what all are got can get out our then him her his their them when into more one now no so me my in on up of to be by do we he at it is im id dont cant wont aint yeah like some she till ill too had put off hey who how way let oh ah gonna gotta".split(" "));

function tokenize(t){ return t.toLowerCase().replace(/[^a-z\s]/g,"").split(/\s+/).filter(w=>w.length>1); }
function buildMap(t){ const m={}; for(const w of tokenize(t)) m[w]=(m[w]||0)+1; return m; }
function buildPresenceMap(songMaps){ const pm={}; for(const m of songMaps) for(const w of Object.keys(m)) pm[w]=(pm[w]||0)+1; return pm; }
function buildRawMap(songMaps){ const m={}; for(const x of songMaps) for(const [w,c] of Object.entries(x)) m[w]=(m[w]||0)+c; return m; }

// ============================================================
//  HUNTER ROOT — DATA
// ============================================================
const HR_LYRICS = {
  "Cheap Wine":         `yeah im drunk man im on a cheap wine sure you could do better but i think im doing fine cheap wine and cigarettes cheap wine i havent quit yet one more pour one more night cheap wine will be alright yeah im drunk`,
  "Straitlaced":        `i came into class and i was late because i stopped to get a coffee and a smoke outside straitlaced they all looked so straitlaced couldnt find my way inside that straitlaced place never fit inside those lines`,
  "So Sick":            `well i swear ill find a brand new home somewhere far away from here im so sick of being sick im so sick of this im so sick of fighting what i feel im so sick`,
  "Identity":           `the devils been riding on my back he fixed my flaws and then he filled the cracks tell me who i am tell me what you see everybody wants to take my identity who do you think i am tell me`,
  "Hook Or The Worm":   `ive learned ive burned am i the hook am i the worm ive been both ive been most human fades into a ghost okay just great this is what life meant to show me now im red youre dead just like the books that we read this is great this is fate nothing is wrong with my head i feel less real dont know what i know i feel what i feel i dont wanna go and i dont wanna stay right here go with the flow first deal last meal`,
  "Television Head":    `television head thats not your god given name i guess im just a product of the media game television head we fill it up with noise television head the signal gets destroyed cant hear the signal through the noise`,
  "Let The Rhythm":     `im just gonna let the rhythm come on in im not gonna question its origin im just gonna let the rhythm wipe my sin and im gonna think about it every night music is my baby and i hold her tight and im gonna sing with her till i feel right oh shes my baby oh shes my bread oh makes me crazy oh keeps me fed i could say i need her but she dont need me i can taste the freedom and its damn near free push me through my pain and shrink my agony`,
  "Silly Situation":    `you dont dont know you dont dont dont dont know such a such a silly situation such a stupid situation such a boring situation poor me please some strange disease poor me please some strange disease such a silly situation such a stupid situation such a shitty situation poor me`,
  "Moving With The Storm": `with the help of a nudge from an invisible force drink mysterious water from an unknown source leading us along a predetermined course feelings of contentment replaced with remorse moving with the storm our connection never torn meaning always escaping our purpose constantly shaping life inside a wheel the sadistic taste of feel patterns of circles in cyclical fluctuations added and layered with a weave of calculations so best is get patient or meet me at the station thats where ill be its not my scene shes not my queen the people in our lives are strung together our heads hearts and lungs are tethered these supple ties a floating feather picking up wind for the worse or the better`,
  "Soul Sucker":        `soul sucker you mother fucker go away someplace far from here soul sucker you heart breaker stay away stay away from here you suck the soul right out of me`,
  "The Shade":          `you dont have to hold that old memory of you lay it in the shade lay it in the shade you dont have to carry what the years put on you lay it in the shade everyone deserves some shade`,
  "Same Page":          `everybody talks but nobody listens everybody sings but nobody hears are we on the same page are we on the same page anymore speaking different languages`,
  "Talker With A Broken Jaw": `talker with a broken jaw got a lot to say but i cant say it all talker with a broken jaw words keep coming out all wrong words keep falling down like walls`,
  "People Are Programs": `people are programs running on repeat same old patterns same old song people are programs cant delete plugged into a grid we dont belong we are programs running running on repeat`,
  "Killer To Killer":   `killer to killer eye to eye we dont speak the same language but we recognize killer to killer nobody wins we both lose everything in the end`,
  "Brain Cell":         `one brain cell left and it belongs to you one brain cell left and i dont know what to do one brain cell and its all burned through`,
  "Fix My Head":        `gonna fix my head gonna start again gonna put myself together in the end gonna fix my head wipe the slate clean gonna be a better man than i have been`,
  "Free To Roam The Cage": `free to roam the cage free to roam the cage the bird knows the bars the bird knows the rage free to roam the cage free inside the prison free to roam the cage`,
  "With Great Pleasure": `with great pleasure comes great pain with great sunshine comes the rain with great pleasure comes great pain i wouldnt have it any other way`,
  "The Water":          `the water never lies it shows you what you are it wont hide the truth no matter how scarred standing at the river standing at the edge the water never lies`,
  "Music On My Mind":   `got music on my mind got music in my blood got music running through me like a flood music on my mind wont let me sleep at night music on my mind its gonna be alright`,
  "What I Felt":        `i wrote it all down what i felt every single word was true what i felt i couldnt help what i felt was always you what i felt i carry still`,
  "Greek Fire":         `greek fire burning in my chest greek fire wont give it a rest burning from the inside out thats what greek fire is about consuming everything i feel`,
  "Shapeshifter":       `oh shapeshifter hit like a twister that smile on your face it can be erased hey there mister you cant fix her just take my advice and move on with your life get your rhythm back on beat hey there sister it barely missed ya so run while you can cause the devils in your man hey there honey you love money much more than your health and much more than yourself get your rhythm back on beat dont care if it comes back on me double crosser you were faster leave this behind take back whats mine`,
  "Lampshade":          `went to bed with a lampshade on my head whiskey talking said im going home instead she said stay a while honey stay a while went to bed with a lampshade on my head woke up on the floor with a headache said ill never do that again but i know that i will`,
  "Favorite Friend":    `you were my favorite friend before the bitter end you were my favorite friend wish i could call you up again you were the one who understood before the bitter end you were my favorite friend`,
  "Little Red Riding Hood": `little red riding hood went walking through the woods talking to the wolves when she probably shouldnt looking for a shortcut looking for a sign little red riding hood she crossed that line big bad wolf said honey where you going`,
  "Homestead":          `take me to my homestead take me somewhere simple where my roots remain take me to my homestead lay me down in green grass let it wash the pain playing chicken with my own demise take me to my homestead where i know the sky where i know my name`,
  "Undertow":           `caught up in the undertow pulling me down somewhere i dont want to go caught up in the undertow cant find my footing nowhere i can hold the current keeps on pushing me the wrong direction i keep on swimming back against the tide`,
  "Family Tree":        `cut the rotten branches from the family tree keep the ones that love you and the ones that let you breathe cut the rotten branches from the family tree everybody carries something they dont want to see we all got something broken in the family tree`,
  "Tongue In Cheek":    `tongue in cheek thats how i say what i mean tongue in cheek they never know what i mean tongue in cheek smile on my face pain underneath tongue in cheek`,
  "Norma Jean":         `norma jean what did they do to you norma jean they never deserved you norma jean you were too bright for this world you burned too bright norma jean`,
  "Impossible Itch":    `got an impossible itch i just cant scratch no matter what i do im always looking back got an impossible itch i just cant scratch looking for the thing i know i never had always chasing always running always reaching`,
  "Upper Hand":         `i never had the upper hand i never had the upper hand the cards were always stacked against me cant find the upper hand never had it never will i still keep trying still`,
  "Wildfire":           `tell me how to live tell me how to die tell me how can i be peaceful fightin for my life give me one more chance to give this one more try this whole lifes a painful dance hang my head and cry my hearts hungry for something more i got a running desire take a chance and cut that cord burn me like a wildfire my heart is hungry for something fierce light me up and take me higher love is all around i see burn me like a wildfire demons have their way of seeping in your life make you second guess that smile and hang on to the strife how was i to know tell me where to go tread that path that no one has through the undergrowth living on a prayer wishing on a star hope to god we find ourselves before it goes too far`,
  "Don't Blame The Breeze": `i wont bat an eye watch the fickle people walk and wave goodbye dont blame the breeze for the leaves that fall from dying trees its just the season its just the way things go`,
  "Nothin' Wrong":      `my makeshift mind is a million men only gotten to know a few of them tell me theres nothin wrong tell me theres nothin wrong with me tell me theres nothin wrong my head is full of everyone but me`,
  "Cusp Of The Mend":   `im just here waiting on a song ill try to convince myself i dont belong im on the cusp of the mend im on the cusp of the mend again almost healed almost whole almost home again on the cusp of the mend`,
  "Cocoon":             `gave you four times you says you gone i crossed my heart and hoped to die wrapped up in a cocoon waiting for my wings to dry waiting for the change waiting for the light`,
  "Patience In The Dark": `ancient complications they will keep you from yourself youre not the only one whos fighting battles by yourself patience in the dark patience in the dark hold on patience in the dark the morning always comes`,
  "Just For Kicks":     `i wont get my fill again until i get my kill just for kicks just for kicks just to see if i still will just to feel something real just for kicks`,
  "Echo Calls Her Name": `sometime before this i thought we were talking but in her mind we were a million miles apart echo calls her name echo calls her name down the hall down the years echo calling`,
  "Shake It Off Of Me": `oh cant put my mind to bed still got that long road ahead shake it off of me shake it off shake it off of me cant let it weigh me down shake it off`,
  "Silver Lining":      `everything feels pointless the world is full of curses got a golden ticket but i havent left for nowhere living in my own mind thats a silver lining got a golden ticket but i havent left for nowhere living in my own mind thats a silver lining`,
  "Quicksand Sinking":  `still my mind lord i cant stop thinking i made myself at home in the quicksand sinking less is more baby show me the door love ease my mind but my bodys still shaking make myself at home in the quicksand sinking my name and my heart baby thats what youll be taking dont fall in love when your heart is still aching show me the way just give me a day love i cant play round here no more ease my mind but my bodys still shaking make yourself at home in the quicksand sinking you dont wanna make your home in the quicksand sinking`,
  "Town Rat Heathen":   `gettin drunk by the figure eight figure one more beer oughta set me straight young and carefree as a boy could be whiskey smokes and lsd railroad tracks run along the creek walk em up and down in the summer heat same ol boy changing like the seasons country kid turned into a town rat heathen daddys in jail for a dui brothers in rehab a second time fucked up on salts and spices of all kinds legal drugs doing double damage to your mind there must be greater forces at play too big to see and impossible say no one alive makes it out unscathed aches and scars now i think were even country kid turned into a town rat heathen gettin high by the covered bridge granny find out gonna flip her lid never did go to a high school dance i was in love with a bad romance now im twenty eight with these aches and pains pray to the devil now with each complaint`,
  "Reverend":           `reverend reverend my soul is tired tried to break the whippit post and put out the fire hell to pay if they had their way they said i had it coming on my very first day reverend reverend i dont understand people try to tell me that im not who i am reverend reverend give your guns to me so i can shrug it off like its all just make believe warden warden i pay my dues make me pay them in a single afternoon reverend reverend it just dont make sense lead me to the water just to put up a fence lord makes no sense at all lead me to the water just to put up a fence lord reverend reverend my tongue is tired twisting every truth till it turned to a lie`,
  "Grain Of Rice":      `just a grain of rice in a sea of sand just a voice that nobody understands grain of rice grain of rice thats all i am sometimes you wonder if youre worth the fight grain of rice trying to shine its light`,
  "Can't Outshine The Truth": `too many times fought for my way even when you get what you want you dont know what to say playing chicken with my own demise too many times ive been too stubborn to apologize cant outshine the truth cant outshine the truth no matter what you do cant outshine the truth`,
  "California Sober":   `lord im high as a kite despite how low i feel cant get any lower till im six feet under california sober yeah thats the deal keep me out of trouble keep me out of thunder california sober california sober`,
  "Good On Paper":      `eye for an eye low and then your high went lookin for water but the well was dry no no i said no lost in the cold silver and gold i bought it for twice as more than the price that it sold no no i said no could it be its just in our nature the master plan only good on paper take it as it comes got me on the run better grab your bullets boy and load that gun go go i said go pistol on the bed paint the walls red and now the moment just replays in my head life on the line guilty of the crime knew sooner or later id be doing time incarceration never felt so fine`,
  "Few Steps Back":     `took a few steps back took a few steps back to see where i been took a few steps back and i dont like what i see took a few steps back sometimes you gotta lose the ground to gain your feet few steps back few steps forward thats the deal`,
  "Run From The Devil": `run from the devil hes always at my door run from the devil he dont want me anymore run from the devil like i havent before the devil hes at my door run from the devil`,
  "Cookin' In The Bathroom": `mama used to cook a different kind of meal daddy used to give us something that wasnt real cookin in the bathroom when the kids were asleep cookin in the bathroom secrets they would keep i was just a kid i didnt know the score watching mama cook through the bathroom door cookin in the bathroom thats how we grew up cookin in the bathroom growing up was rough addict parents and the trauma stays with you cookin in the bathroom nothing you can do`,
  "Chase The Dragon":   `chase the dragon up the hill chase the dragon never still chasing something that you never gonna find chase the dragon in your mind brother you were always chasing brother you were always running from yourself chasing shadows in the dark chasing the dragon with a broken heart never gonna catch it never gonna stop always chasing always chasing whats not there`,
  "A Pot Song":         `i get by i get stoned i get high right when i get home i got a lighter got a bowl got the devils green gold got papers i cant roll i smoke pot i smoke a lot i said doc i aint aiming to stop got a dealer on the phone dont grow it on my own legal everywhere cept the state i call home least i aint sitting in prison at the moment we can smoke together but i really like smoking alone i saw a cop i saw a lot at the dui checkpoint stop got a gram inside my coat that i really wanna toke i was on my way to buy some tops he said sir is that herb im picking up on your nerves i thought for a while with an innocent smile said no sir then my thoughts ran wild no i aint high but i must look fried and i fit the profile of a reefer tokin kinda guy he said search i said no he said out the damn door ya go then he threw me on the hood said youre lying no good i got jail i got bailed i got high when the morning was pale i said i love to smoke weed and i hope it loves me weve been spending time together eight days a week cant get enough had to put me in the cuffs said a couple lines too much and ya called my bluff`,
  "'94":                `back in 94 bronco daddy had a ford and he ran it all the way to the ground drunk and driving i was just born yeah he took off from the big bad law pennsylvania into arkansas shotgun to the shoulder he was shooting for the head and now hes 30 years older i used to have a big brother he died of cancer thats the answer he died a heroin addict god is a master of writing the tragic kensington was his second home took him to the station skin and bone deathbed wheelchair off he goes getting high in a tent cause its all he knows back in 1994 glad i woke up but i didnt wake up too sure back in 1993 the devil made his way inside a kid and he never broke free`,
  "Low":                `feeling low lower than ive been before feeling low dont know what im living for feeling low the ground keeps falling away feeling low just trying to make it through the day feeling low but i keep getting up low but i keep getting up`,
  "String Up a Necklace": `she made me a necklace to remind me of home something to carry when im out alone string it up string it up a necklace made of love something to hold when the road gets long she made it with her hands when i was gone to remind me where i belong string it up carry it around`,
  "Hand in the Fire":   `hand in the fire thats where i keep ending up hand in the fire never learning enough hand in the fire burning all the time hand in the fire trying to feel alive hand in the fire my own worst enemy hand in the fire that fire is all me`,
  "Flash in the Pan":   `flash in the pan thats what they say when your fifteen minutes fades away flash in the pan working class man trying to make it on minimum wage flash in the pan the rich dont care and the poor just struggle to get there flash in the pan`,
  "Friendly Fire":      `friendly fire thats what they call it when the ones you love are the ones who hurt you friendly fire burning me alive friendly fire coming from your side friendly fire from the people that i trusted friendly fire how do i survive`,
  "The Devil is the Culprit": `the devil is the culprit every time the devil is the culprit and the crime is mine the devil is the culprit but i pulled the trigger the devil is the culprit makes it hard to figure where the blame ends and i begin the devil is the culprit or is it just the sin`,
  "If the Body is a Temple": `if the body is a temple mine is in ruin if the body is a temple i havent been tending to it if the body is a temple mine is crumbling down lyme disease and nerve pain wearing the temple to the ground if the body is a temple mine has seen better days`,
  "The Keeper":         `im the keeper of the stories no one wants to tell im the keeper of the secrets everyone wants to sell im the keeper of the pain im the keeper of the rain im the keeper gonna keep it till the day that i die`,
  "Out of my Hands":    `out of my hands thats where it had to go out of my hands i finally had to let it go out of my hands i tried to hold on too long out of my hands learning where i went wrong out of my hands finding some peace tonight`,
  "Bad Sign":           `bad sign when you wake up and the darkness feels right bad sign when you cant find the morning light bad sign bad sign ive been seeing bad signs all along bad sign but im still here still trying to be strong bad sign`,
  "My Brother's Bones": `my brothers bones aint got no home but im gonna give them one my brothers bones aint got no home but im gonna give them one someday my brothers bones scattered in the wind my brothers bones i want to find them again`,
};

const HR_DISCOGRAPHY = {
  "They Finally Cracked Me":{ year:2018, color:"#9a6a3a",
    tracks:["Cheap Wine","Straitlaced","So Sick","Identity","Hook Or The Worm","Television Head","Let The Rhythm","Silly Situation","Moving With The Storm","Soul Sucker","The Shade"]},
  "Life Inside a Wheel":{ year:2019, color:"#4a8a4a",
    tracks:["Same Page","Talker With A Broken Jaw","People Are Programs","Killer To Killer","Brain Cell","Fix My Head","Free To Roam The Cage","With Great Pleasure","The Water","Music On My Mind","What I Felt","Greek Fire","Shapeshifter"]},
  "Mimicking the Sun Like Dandelions":{ year:2020, color:"#3a7a9a",
    tracks:["Lampshade","Favorite Friend","Little Red Riding Hood","Homestead","Undertow","Family Tree","Tongue In Cheek","Norma Jean","Impossible Itch","Upper Hand","Wildfire"]},
  "Skipping Stones That Sink Before They're Thrown":{ year:2021, color:"#8a3a8a",
    tracks:["Don't Blame The Breeze","Nothin' Wrong","Cusp Of The Mend","Cocoon","Patience In The Dark","Just For Kicks","Echo Calls Her Name","The Shade","Shake It Off Of Me","Run From The Devil"]},
  "Arkansas":{ year:2023, color:"#ba5a2a",
    tracks:["Silver Lining","Quicksand Sinking","Town Rat Heathen","Reverend","Grain Of Rice","Can't Outshine The Truth","California Sober","Good On Paper","Few Steps Back","Run From The Devil","Silver Lining (Reprise)"]},
  "Crooked Home":{ year:2025, color:"#3a5aaa",
    tracks:["'94","Low","String Up a Necklace","Hand in the Fire","Flash in the Pan","Friendly Fire","The Devil is the Culprit","If the Body is a Temple","The Keeper","Out of my Hands","Bad Sign","My Brother's Bones"]},
};
const HR_SINGLES = ["Cookin' In The Bathroom","Chase The Dragon","A Pot Song"];

const HR_THEMES = [
  { name:"Addiction & Substance",   color:"#e74c3c", words:["whiskey","drunk","wine","beer","lsd","high","sober","heroin","drugs","addict","rehab","smoke","cigarette","addiction","kite","weed","pills","stoned","pot","dealer","bailed","jail","dui","salts","spices","cook","cookin"] },
  { name:"Family & Loss",           color:"#9b59b6", words:["brother","daddy","dad","father","granny","family","mother","sister","bones","died","death","cancer","grief","home","homestead","brothers","parents","mama","nick"] },
  { name:"Pain & Survival",         color:"#e67e22", words:["pain","aches","scars","sick","hurt","broken","tired","suffering","wounds","healing","mend","struggle","dark","darkness","itch","burn","burning","agony","hungry","cry","rough","low","lyme","nerve"] },
  { name:"Devil & God / Spiritual",  color:"#c0392b", words:["devil","god","lord","reverend","warden","hell","soul","pray","sin","demon","curse","faith","church","fire","believe","wishing","prayer","culprit","satan","evil"] },
  { name:"Place & Rootedness",       color:"#27ae60", words:["home","arkansas","pennsylvania","country","town","creek","bridge","railroad","road","roots","land","ground","earth","homestead","somewhere","woods","kensington","river"] },
  { name:"Mind & Identity",          color:"#2980b9", words:["mind","think","thinking","brain","identity","self","know","lost","truth","lie","real","fake","head","feel","feeling","soul","makeshift","program","programs","who","what"] },
  { name:"Escape & Running",         color:"#f39c12", words:["run","running","escape","leave","away","gone","hide","free","roam","cage","chase","chasing","reaching","road","ride","dragon","flee"] },
  { name:"Music & Creativity",       color:"#1abc9c", words:["music","song","rhythm","sing","singing","melody","guitar","voice","beat","sound","play","playing"] },
];

const HR_ARC_NOTES = {
  "Addiction & Substance": "Substance language opens quietly in 2018 (Cheap Wine, Straitlaced), accelerates through the middle albums, and reaches peak density in Arkansas. A Pot Song (2025 single) adds a rare comedic treatment. Crooked Home reframes addiction as inherited damage: Cookin' In The Bathroom turns the parent's using into a childhood trauma scar.",
  "Family & Loss": "Near-absent in 2018, family language first emerges in Mimicking (Family Tree, Homestead). After Nick's death in 2020, it becomes the gravitational center. Arkansas is the first full grief album. Crooked Home goes deeper \u2014 '94, My Brother's Bones, Chase The Dragon. 'Brother' appears in more songs than almost any other noun in the catalog.",
  "Pain & Survival": "His most consistent theme, present at equal weight in every album. Each era finds a new form \u2014 youthful recklessness, relational ache, grief, physical illness (Lyme disease, nerve pain). Pain is the one constant that never leaves.",
  "Devil & God / Spiritual": "Peaks dramatically with Arkansas. Reverend is his most explicitly theological song. The devil appears in nearly every album but isn't vanquished \u2014 he's a recurring character. By Crooked Home (The Devil is the Culprit), Root questions whether the devil is external or internal.",
  "Place & Rootedness": "Homestead, Arkansas, Pennsylvania, Kensington \u2014 Root is a poet of specific geography. Home spans more songs than almost any other noun. He always knows where he is, even when he's lost.",
  "Mind & Identity": "Loudest on the early albums \u2014 People Are Programs, Television Head, Identity all wrestle with who he is. By 2023\u20132025, the question shifts from 'who am I?' to 'what did my past make me?'",
  "Escape & Running": "Peaks in the Arkansas/singles era. Run from the Devil, Chase the Dragon, Quicksand Sinking. By Crooked Home the running slows \u2014 Out of My Hands, The Keeper suggest he's learning to stop fleeing.",
  "Music & Creativity": "Almost entirely the debut. Let The Rhythm is the purest statement of music as religion. After that, music stops being the subject and becomes the vehicle. He doesn't write about writing once he has something more urgent to write about.",
};

const HR_JUICE_FORMULA = {
  intro: "Pain and survival language appears in more songs than any other theme. Family and loss are the emotional engine \u2014 \"brother,\" \"home,\" \"daddy\" span more songs than any other nouns in the catalog.",
  formula: "The Formula: Confessional specificity + universal ache. The covered bridge, the Bronco, the DUI checkpoint, the lampshade, Kensington. The detail is the intimacy. That's the juice.",
};

// ============================================================
//  JESSE WELLES — DATA
// ============================================================
const JW_LYRICS = {
  "War Isn't Murder": `war isnt murder good men dont die children dont starve and all women survive war isnt murder thats what they say when youre fighting the devil murders okay war isnt murder theyre called casualties there aint a veteran with a good nights sleep lets talk about dead people i mean a dead people the dead dont feel honored they dont feel that brave they dont feel avenged theyre lucky if they got graves call your dead mother ask her when she died its a deathly silence on the other line the dead dont talk but their children dont forget so in 20 short years you could live to regret that war isnt murder theres money at stake hell even kushner agrees its good real estate war isnt murder ask netanyahu hes got a psalm for that and a bomb for you war isnt murder its an old desert faith its a nation state sanctioned righteous hate lets talk about dead people i mean a dead people war isnt murder its the vengeance of god if you cant see the bodies they dont bloat when they rot and the flies dont swarm and the children dont cry if war isnt murder good men dont die so in a short 20 years when you vacation the strip dont think about the dead and have a nice trip war isnt murder we should all give thanks i saw it all in a movie give it up for tom hanks war isnt murder they dont ship out the poor and the bullets they fire arent part of the cure war isnt murder land is a right but the banks called dibs its something you cant fight lets talk about dead people i mean a dead people the dead dont feel honor they dont feel that brave they dont feel avenged theyre lucky if they got graves war isnt murder aint a river of blood stretching all through time and raining down in a flood its a dark sacrifice made on your behalf so get down on your knees and thank the sweet lord that war isnt murder`,
  "The Poor": `if you worked a little harder then youd have a lot more so the blame and the shames on you for being so damn poor it aint the price gouging and it aint the inflation it aint everyone above ya tryna make a buck from ya and screwin the whole congregation i had that reduced lunch i had the benefit cards it never occurred to me to blame my family for life being so damn hard i shouldve paid attention back when i was in school then i could figure up the tax i would know a lot of facts i missed the class where they taught the rules i was memorizing capitols i was in the spelling bee i mustve missed the part where they taught the art of private equity i was selling chocolate bars i had a disorder i was cuttin up a frog got lost in the fog learnin how to play a recorder if you only worked a little harder then youd have a lot more so the blame and the shames on you for being so damn poor it aint the banks and it aint the taxes it aint the pay day loans and the high rent homes and predatory fees and practices wave your dumb flag whatever it means but you should ask yourself when it comes to health are the poor really all that free`,
  "United Health": `there aint no you in unitedhealth there aint no me in the company there aint no us in the private trust theres hardly humans in humanity now ceos come and go and one just went the ingredients you got bake the cake that you get theres a million luigi mangiones all across this land they know the game and they understand there aint no you in unitedhealth there aint no me in the company theres hardly health in the system itself theres no care in the company`,
  "Horses": `all my flannels made in bangladesh all my tshirts in vietnam there are places that we quietly ignore there are places that we go and bomb you know i thought an awful lot about jesus even more about lao tzu they say that the way of the tao is to do nothing then what the hell am i supposed to do you know the harder you think the deeper you sink the tighter you grip the more that you slip so im singing this song about loving all the people that youve come to hate its true what they say im gonna die someday why am i holding on to all this weight you know i really thought that thered be power in thinking half of yall was just born fools thought i was gathering oats for my horses i was getting by whipping my mules theres a book i read i dont remember theres a place ive been id never seen theres a note that i wrote that went up in smoke theres some songs i dont ever sing all the stars in the sky are burning mostly burning unbeknownst to me i wish i wouldve paid more attention to the bigger things i didnt see you know the harder you think the deeper you sink the tighter your grip the more that you slip so im singing this song about loving all the people that youve come to hate`,
  "Fentanyl": `fentanyl the atom bomb of drugs fentanyl it falls on all of us fentanyl sent down from up above fentanyl what are we gonna do about love send dough to the enforcement they build another jail give money to a hammer theyre gonna buy a nail fentanyl the atom bomb of drugs fentanyl it falls on all of us they put it in the water they put it in the air they put it in the food you eat when nobody was there and you wonder why the young ones never had a chance they never had a fighting chance fentanyl fentanyl`,
  "Cancer": `cancer as lucrative a business as a war so if you aint expecting peace then why expect a cure cancer in the water cancer in the air cancer in the food you eat cancer everywhere cancer its a business cancer its a crime cancer gonna get you sooner or later down the line if you aint got the money then the money dont care cancer is as lucrative a business as a war`,
  "Fat": `well its your own damn fault youre so damn fat shame shame shame all the food on the shelf was engineered for your health so youre gonna have to take the blame they made it cheap they made it fast they made it good enough to last and you ate it up because youre weak and now youre fat and you reek shame shame shame well its your own damn fault youre so damn fat`,
  "Depression": `depression its a long road home depression carrying this weight alone depression everybody gets it at some point depression its a long long road depression knocking at the door again depression telling me i aint no good depression lying down inside my brain depression i wish i understood why do i feel this way when the sun is shining bright depression you dont play fair depression in the dark of night`,
  "Payola": `payola they been paying for the airplay payola since the very early days payola thats the name of the game payola when the money does the talking payola when the truth goes walking payola thats the name of the game they decide what you hear they decide what you feel they decide whats real and what gets the deal payola payola`,
  "Whistle Boeing": `whistle boeing whistle boeing if you know something say something whistle boeing whistle boeing they threw the whistleblowers out the window whistle boeing whistle boeing corporate accountability is zero whistle boeing whistle boeing if you know something say something before they silence you too`,
  "Slaves": `we are slaves we work for pennies on the dollar we are slaves we carry all the weight we are slaves we never gonna holler loud enough to change the minimum wage we are slaves we built this whole damn country we are slaves we never got our due we are slaves history dont mention us until its convenient for the truth`,
  "Happy Easter": `happy easter happy easter jesus died for all your sins happy easter happy easter now its time to shop again happy easter at the megachurch with the rock band and the lights happy easter at the gun store buying rights happy easter at the brunch buffet with the bottomless mimosas happy easter telling people what they owe us`,
  "News": `the news the news the news is bad again the news the news i cant watch anymore the news the news its all designed to spin the news the news im checking out the door everything is burning everything is fine everything is ending all the time the news the news the news is bad again`,
  "Trump Trailers": `trump trailers flying from the truck beds trump trailers waving in the yard trump trailers people really love him trump trailers that dont seem that hard trump trailers in the trailer parks trump trailers all across the land trump trailers making people feel like someone understands`,
  "Boot Straps": `pull yourself up by your bootstraps thats what they say pull yourself up by your bootstraps every single day pull yourself up by your bootstraps if you dont have any boots pull yourself up by your bootstraps and follow all the rules its easy if you try its simple just work hard ignore the broken system pull yourself up by your bootstraps pull yourself up`,
  "Misery": `misery loves company misery loves to stay misery moved in one day and never went away misery sitting at my table misery eating all my food misery telling me that everything is coming unglued misery loves company misery loves me`,
  "Hell": `hell is other peoples opinions hell is reading the comments section hell is a cable news loop hell is a sunday morning congregation hell is a traffic jam with no exit hell is being right when it doesnt matter hell is the land of good intentions hell is where we all seem to gather`,
  "New Moon": `new moon new beginning new moon gonna try again new moon washing all the old away new moon starting over today new moon light on the water new moon quiet in the dark new moon something in the distance new moon fire in my heart`,
  "Fear is the Mind Killer": `fear is the mind killer fear is the little death that brings total obliteration i will face my fear i will let it pass over me and through me and when the fear is gone i will turn to see its path where the fear has gone there will be nothing only i will remain fear is the mind killer fear is what they sell you fear is how they hold you fear is all they have`,
  "Saint Steve Irwin": `saint steve irwin he loved every creature saint steve irwin he got down in the mud saint steve irwin he had no fear in him saint steve irwin died from a stingray stud saint steve irwin he would grab the dangerous ones saint steve irwin he would look them in the eye saint steve irwin we could use a man like that saint steve irwin we miss you till we die`,
  "See Arkansaw": `see arkansaw see it clear see arkansaw this is where i come from here the hills and the hollers and the rivers running cold see arkansaw where ive been told to go see arkansaw see the poverty see arkansaw see the beauty and the pain see arkansaw politicians never mention see arkansaw but they always want our vote`,
  "Innit to Win": `innit to win innit innit to win innit innit to win the whole damn game innit to win innit innit to win innit innit to win or whats the point innit capitalism innit at its finest innit everyone is playing everyone the same innit to win innit`,
  "My Little Town": `my little town everybody knows your business my little town everybody in your face my little town you cant escape your history my little town you cant outrun your place my little town i love you and i hate you my little town i always come back home my little town theres something here that holds me my little town i never feel alone`,
  "Walmart": `walmart i saw a toddler eat a cigarette on a cart of keystone beer walmart where the greeters look like they gave up on life years ago walmart where the checkout lines stretch to infinity walmart where america shops and america shows walmart walmart everything is ninety nine cents walmart walmart made in china on the shelf`,
  "If I Died": `if i died tomorrow would you remember me if i died tomorrow would it set you free if i died tomorrow would the world go on if i died tomorrow would my songs live long if i died tomorrow would you play my music if i died tomorrow would you finally use it if i died tomorrow id want you to know that i was glad i was here even so`,
  "Bugs": `bugs bugs bugs i love the bugs bugs bugs bugs all my little bugs bugs they pollinate the flowers bugs they decompose the dead bugs they run the whole damn planet bugs theyre living in your bed bugs bugs bugs i love the bugs sorry for the windshield sorry for the raid sorry for the pesticide that we have made bugs bugs bugs i love the bugs`,
  "Trees": `trees trees trees i love the trees trees trees trees all my tall green trees trees theyre probably smarter than you and me trees they been here longer trees they breathe out what we breathe in trees they never started any wars trees trees trees i love the trees you tell me your favorite ill tell you mine i like the tall ones short ones ones with great big roots trees`,
  "Turtles": `turtles turtles slow and steady turtles turtles never in a rush turtles turtles carrying their home turtles turtles never make a fuss turtles been around since dinosaurs turtles seen it all come and go turtles probably know something we dont turtles living nice and slow`,
  "Squirrels": `squirrels squirrels running up the tree squirrels squirrels stashing all their seeds squirrels squirrels planning for the winter squirrels squirrels living in the breeze squirrels they dont have a pension plan squirrels they dont have a four oh one squirrels they just bury all their treasure squirrels they just live and have fun`,
  "Autumn": `autumn leaves are falling autumn air is cool autumn everything is dying autumn beautiful autumn slowing down now autumn letting go autumn colors burning autumn what we know is that everything ends everything changes everything falls and rises autumn teach me how to do it autumn teach me how to let go`,
  "Whales": `whales in the ocean singing whales in the deep down dark whales in the world we destroyed whales breaking all our hearts whales they talk to one another whales they travel far and wide whales they were here before us whales theyll outlive us if they survive whales singing songs of loneliness whales singing songs of love whales in the plastic ocean whales what have we done`,
  "Certain": `im not certain of anything anymore im not certain of the things i was before im not certain of the left or of the right im not certain who to trust im not certain of the fight but im certain that i love you im certain of that much im certain when i hold you im certain of your touch im not certain of the future im not certain of the past im not certain of a thing except the things that last`,
  "I'm Sorry": `im sorry for the things i said im sorry for the things inside my head im sorry i am wired this way im sorry i dont always know what to say im sorry to the people that i love im sorry that i never was enough im sorry to the younger version of me im sorry he grew up and had to see im sorry to the world for all my flaws im sorry that i never paused`,
  "Wheel": `the wheel keeps turning the wheel keeps turning around the wheel keeps turning the wheel keeps turning around everything that rises must fall down everything that falls will rise again the wheel keeps turning the wheel keeps turning around i was high i was low i was everything between the wheel keeps turning and it dont care what it means`,
  "Anything But Me": `anything but me you blame anything but me you shame anything but me when its convenient anything but me when theres no cost anything but me you point the finger anything but me you count the loss anything but me the system the economy anything but me just not accountability`,
  "Every Grain of Sand": `every grain of sand every drop of rain every blade of grass every joy and every pain every life that ever lived and every life to come every grain of sand under the same sun every grain of sand matters every grain of sand counts every grain of sand is something you cant discount`,
  "Why Don't You Love Me": `why dont you love me the way i love you why dont you need me the way i need you why dont you see me the way i see you why dont you love me the way i love you i do everything i can i give everything i have why dont you love me why dont you love me back`,
  "War is a God": `war is a god war is a god we worship war is a god we feed it war is a god we need it war is a god we believe it war has always been our highest calling war is a god we pray to war is a god we pay to war is a god we made it and now we cant escape it war is a god`,
  "Middle": `somewhere in the middle somewhere between the right and wrong somewhere in the middle where most of us belong somewhere in the middle trying to hold it together somewhere in the middle hoping for better weather somewhere in the middle thats where i live most of the time somewhere in the middle doing the best i can with what i find`,
  "We're All Gonna Die": `were all gonna die were all gonna die someday were all gonna die theres nothing you can do were all gonna die might as well be kind were all gonna die might as well speak your mind were all gonna die so love the people close to you were all gonna die so say what you need to say were all gonna die so live it today`,
  "Change Is In The Air": `change is in the air i can smell it change is in the air i can feel it change is in the air like a storm coming change is in the air you better believe it change is in the air for the better change is in the air for the worse change is in the air we dont know yet change is in the air lift your face`,
  "Pilgrim": `pilgrim on the road pilgrim carry your load pilgrim long way from home pilgrim walking alone pilgrim every road leads somewhere pilgrim every burden has a name pilgrim you are not the first pilgrim you wont be the last pilgrim`,
  "Far From Home": `far from home far from everything i know far from home all these miles that i go far from home missing all the faces far from home missing all the places where i grew up where i came from where the people know my name far from home far from home`,
  "Grapes Of Wrath": `grapes of wrath steinbeck got it right grapes of wrath the workers and the fight grapes of wrath nothing ever changes grapes of wrath they break us in stages grapes of wrath the landlords and the banks grapes of wrath we never get our thanks grapes of wrath the highway going west grapes of wrath the american protest`,
  "Wild Onions": `wild onions growing in the field wild onions what the earth will yield wild onions free for anyone who looks wild onions not for sale in any books wild onions growing by the creek wild onions every spring i seek wild onions taste like where you come from wild onions taste like home`,
  "The Great Caucasian God": `the great caucasian god in all his glory the great caucasian god the only story the great caucasian god on every dollar the great caucasian god the loudest hollerer the great caucasian god in every government the great caucasian god youre gonna love it the great caucasian god or else`,
  "In The Morning": `in the morning i wake up and try again in the morning before the news begins in the morning when the world is still and quiet in the morning before they start the riot in the morning coffee and a little peace in the morning all the noise will cease in the morning i remember who i am in the morning before it all began`,
  "Malaise": `malaise settling in malaise cant shake the skin malaise something wrong but nothing i can name malaise everything is broken but its all the same malaise the country got it malaise the people got it malaise nobody knows what to do about the malaise`,
  "Hold On": `hold on dont let go hold on something good is coming hold on even when its dark hold on even when youre running hold on for the ones who need you hold on for the love you feel hold on nothing lasts forever hold on even pain can heal hold on hold on`,
  "It Don't Come Easy": `it dont come easy nothing worth having does it dont come easy you gotta work for love it dont come easy the good life or the music it dont come easy but if you lose it you know it it dont come easy and that is why it matters it dont come easy nothing worth having does`,
  "Don't Go Giving Up": `dont go giving up on love dont go giving up on people dont go giving up on trying dont go giving up on equal dont go giving up on morning dont go giving up on night dont go giving up the good fight dont go giving up what is right`,
  "America Girl": `america girl you were sold a bill of goods america girl they never told you what it would cost america girl the dream was always conditional america girl now youre fighting for whats lost america girl the flag was never meant for you america girl the land was never free america girl but youre still standing america girl thats something to see`,
  "Don't We Get By": `dont we get by dont we get through dont we find a way to do what we got to do dont we get by with a little help dont we get by being somebody else for a while dont we get by dont we get by`,
  "Saddest Factory": `saddest factory in the whole damn town saddest factory watching it shut down saddest factory where my daddy worked saddest factory where the jobs were saddest factory rust belt american dream saddest factory nothing is what it seems saddest factory closed the doors and left saddest factory took away what we had left`,
  "John": `john was just a regular man john worked hard and did the best he can john never asked for much john just wanted to be loved john raised his kids and paid his bills john believed in all the usual thrills john got sick and lost his job john the system let him down john`,
  "This Age": `this age this age we live in this age this age of everything and nothing this age this age of information this age this age of isolation this age when everything is instant this age when nothing seems to last this age this age we live in this age is moving way too fast`,
  "Complain": `you can always complain you can always find something wrong you can always complain about how the world done you wrong complain complain complain thats all they do they got all the options open and they choose to be blue you can always complain or you can try to do something about it`,
  "God Abraham & Xanax": `god abraham and xanax the holy trinity of feeling fine god abraham and xanax take one of each and you feel divine god abraham and xanax the american religion god abraham and xanax medicate the contradiction god abraham and xanax pray away the pain god abraham and xanax wash it down again`,
  "DuPont": `dupont they put the chemicals in the water dupont they knew what they were doing dupont they hid the studies in a folder dupont they kept on with the ruining dupont teflon in the bloodstream dupont forever chemicals forever dupont they paid a settlement dupont and did it again whatever`,
  "The Olympics": `the olympics everyone comes together the olympics to watch the fastest the strongest the best the olympics nationalism wrapped in sport the olympics we love it or we protest the olympics money money money the olympics who gets to host the olympics build the stadiums tear em down the olympics who benefits the most`,
  "Nickelodeon": `nickelodeon what happened behind the scenes nickelodeon somebody should have said something nickelodeon the kids were just props nickelodeon for the adults at the top nickelodeon we watched it every day nickelodeon we never knew what they made us pay nickelodeon the price of childhood fame nickelodeon and everybody played the game`,
  "Genocide Cake": `genocide cake bake it up and eat it genocide cake everybody has a piece genocide cake dress it up real pretty genocide cake call it national security genocide cake every generation genocide cake the recipe dont change genocide cake somebody always profits genocide cake somebody always pays`,
  "Happy Mother's Day": `happy mothers day to the single mothers happy mothers day to the ones who stay up late happy mothers day to the ones who never get the credit happy mothers day to the ones who carry all the weight happy mothers day to the mothers who are struggling happy mothers day to the ones the system failed happy mothers day you deserve so much better happy mothers day we failed you we failed`,
  "Horcrux": `horcrux you split your soul for power horcrux you put it in a jar horcrux voldemort had seven horcrux where did you put yours horcrux is it in your money horcrux is it in your pride horcrux is it in the things you did to get here horcrux what did you leave behind`,
  "This is Not My Song": `this is not my song i borrowed every word this is not my song these melodies are borrowed this is not my song it came from something bigger this is not my song i just caught it in the air this is not my song its yours if you can use it this is not my song take it if you dare`,
  "Let It Be Me": `let it be me who holds the light let it be me who stands for right let it be me who speaks the truth let it be me who fights for you let it be me when nobody else will let it be me standing on the hill let it be me i want to be the one let it be me before the job is done`,
  "That Can't Be Right": `that cant be right something is wrong here that cant be right i did everything right that cant be right i followed all the rules that cant be right i went to all the schools that cant be right the system must be broken that cant be right these words must not be spoken that cant be right somebody is lying that cant be right`,
  "Join ICE": `well if youre looking for purpose in the current circus if youre lacking control and authority come with me and hunt down minorities join ice join ice if you want a uniform if you want to feel important join ice join ice if the law dont mean what you want it to join ice if youre angry join ice if youre scared join ice we got authority to spare`,
  "Red": `red the color of the blood on the street red the color of the party you keep red the color of the rage in the heart red the color of a country torn apart red flags flying everywhere red and it dont mean what it used to red the cost of what we cannot share red the color of america too`,
  "Genocide Cake": `genocide cake bake it up and eat it genocide cake everybody has a piece genocide cake dress it up real pretty genocide cake call it national security genocide cake every generation genocide cake the recipe dont change genocide cake somebody always profits genocide cake somebody always pays`,
  "Nickelodeon": `nickelodeon what happened behind the scenes nickelodeon somebody should have said something nickelodeon the kids were just props nickelodeon for the adults at the top nickelodeon we watched it every day nickelodeon we never knew what they made us pay nickelodeon the price of childhood fame nickelodeon and everybody played the game`,
  "Simple Gifts": `simple gifts simple joys simple pleasures simple toys simple gifts the things that matter most simple gifts a life with love a life with hope simple gifts theyre free for all of us simple gifts if we just learn to trust`,
  "Rocket Man": `rocket man flying up so high rocket man leaving earth behind rocket man all alone in space rocket man missing the human race rocket man wishing he could stay rocket man burning out his way rocket man elton knew the deal rocket man nothing up here feels real`,
  "Philanthropist": `philanthropist giving with one hand taking with the other philanthropist tax write off brother philanthropist the cameras are rolling philanthropist the ego is showing philanthropist charity is a business philanthropist poverty is their witness`,
  "Will The Computer Love The Sunset": `will the computer love the sunset will it feel the warmth upon its screen will the computer write a poem will it know what beauty means will the computer love the sunset the way that you and i will the computer shed a tear when it watches daylight die`,
  "GTFOH": `gtfoh get the hell out of here gtfoh the nonsense is near gtfoh ive had enough of the noise gtfoh losing all of my poise gtfoh the circus is in town gtfoh send in the clowns`,
  "Forever Whatever": `forever whatever thats how long ill care forever whatever ill always be there forever whatever the world may change forever whatever love stays the same forever whatever thats what i believe forever whatever you and me`,
  "Gilgamesh": `gilgamesh the oldest story ever told gilgamesh a king searching for his soul gilgamesh he lost his only friend gilgamesh he couldnt find the end gilgamesh immortality was not his fate gilgamesh he learned that love was worth the wait gilgamesh the first to grieve gilgamesh the last to leave`,
  "No Kings": `no kings no masters no rulers on high no kings no crowns no reasons why no kings no thrones no divine right no kings just people trying to get it right no kings no kings`,
  "Have You Ever Seen The Rain": `have you ever seen the rain coming down on a sunny day have you ever seen the rain falling when theres nothing left to say have you ever seen the rain washing all the pain away have you ever seen the rain`,
  "The Great Caucasian God (With The Devil)": `the great caucasian god in all his glory the great caucasian god the only story the great caucasian god on every dollar the great caucasian god the loudest hollerer the great caucasian god in every government the great caucasian god youre gonna love it the great caucasian god or else`,
  "In The Morning (With The Devil)": `in the morning i wake up and try again in the morning before the news begins in the morning when the world is still and quiet in the morning before they start the riot in the morning coffee and a little peace in the morning all the noise will cease in the morning i remember who i am in the morning before it all began`,
  "Malaise (With The Devil)": `malaise settling in malaise cant shake the skin malaise something wrong but nothing i can name malaise everything is broken but its all the same malaise the country got it malaise the people got it malaise nobody knows what to do about the malaise`,
  "Hold On (With The Devil)": `hold on dont let go hold on something good is coming hold on even when its dark hold on even when youre running hold on for the ones who need you hold on for the love you feel hold on nothing lasts forever hold on even pain can heal hold on hold on`,
  "It Don't Come Easy (With The Devil)": `it dont come easy nothing worth having does it dont come easy you gotta work for love it dont come easy the good life or the music it dont come easy but if you lose it you know it it dont come easy and that is why it matters it dont come easy nothing worth having does`,
  "Don't Go Giving Up (With The Devil)": `dont go giving up on love dont go giving up on people dont go giving up on trying dont go giving up on equal dont go giving up on morning dont go giving up on night dont go giving up the good fight dont go giving up what is right`,
  "America Girl (With The Devil)": `america girl you were sold a bill of goods america girl they never told you what it would cost america girl the dream was always conditional america girl now youre fighting for whats lost america girl the flag was never meant for you america girl the land was never free america girl but youre still standing america girl thats something to see`,
  "Don't We Get By (With The Devil)": `dont we get by dont we get through dont we find a way to do what we got to do dont we get by with a little help dont we get by being somebody else for a while dont we get by dont we get by`,
  "Saddest Factory (With The Devil)": `saddest factory in the whole damn town saddest factory watching it shut down saddest factory where my daddy worked saddest factory where the jobs were saddest factory rust belt american dream saddest factory nothing is what it seems saddest factory closed the doors and left saddest factory took away what we had left`,
  "John (With The Devil)": `john was just a regular man john worked hard and did the best he can john never asked for much john just wanted to be loved john raised his kids and paid his bills john believed in all the usual thrills john got sick and lost his job john the system let him down john`,
  "This Age (With The Devil)": `this age this age we live in this age this age of everything and nothing this age this age of information this age this age of isolation this age when everything is instant this age when nothing seems to last this age this age we live in this age is moving way too fast`,
};

const JW_DISCOGRAPHY = {
  "Hells Welles": {
    year: 2024, color: "#b84a4a",
    tracks: ["War Isn't Murder","Payola","Cancer","The Olympics","God Abraham & Xanax","Whistle Boeing","Fat","Fentanyl","Slaves","Happy Easter","News","Trump Trailers","Genocide Cake","Nickelodeon","DuPont","Complain","Boot Straps","Depression","Happy Mother's Day","Misery","Hell"]
  },
  "Patchwork": {
    year: 2024, color: "#7a8a3a",
    tracks: ["New Moon","That Can't Be Right","Fear is the Mind Killer","Saint Steve Irwin","See Arkansaw","Let It Be Me","This is Not My Song","Horcrux","Innit to Win","My Little Town","Walmart","If I Died"]
  },
  "All Creatures Great and Small": {
    year: 2024, color: "#3a8a5a",
    tracks: ["Bugs","Trees","Turtles","Squirrels","Autumn","Whales"]
  },
  "Middle": {
    year: 2025, color: "#3a6aaa",
    tracks: ["Horses","Certain","I'm Sorry","Fear is the Mind Killer","Wheel","Anything But Me","Every Grain of Sand","Simple Gifts","Why Don't You Love Me","Rocket Man","War is a God","Middle"]
  },
  "Pilgrim": {
    year: 2025, color: "#8a4aaa",
    tracks: ["We're All Gonna Die","Change Is In The Air","Forever Whatever","Gilgamesh","Pilgrim","Far From Home","Philanthropist","Will The Computer Love The Sunset","GTFOH","Grapes Of Wrath","Wild Onions"]
  },
  "Devil's Den": {
    year: 2025, color: "#c07030",
    tracks: ["The Great Caucasian God","In The Morning","Malaise","Hold On","It Don't Come Easy","Don't Go Giving Up","America Girl","Don't We Get By","Saddest Factory","John","This Age"]
  },
  "With The Devil": {
    year: 2025, color: "#6a3a2a",
    tracks: ["The Great Caucasian God (With The Devil)","In The Morning (With The Devil)","Malaise (With The Devil)","Hold On (With The Devil)","It Don't Come Easy (With The Devil)","Don't Go Giving Up (With The Devil)","America Girl (With The Devil)","Don't We Get By (With The Devil)","Saddest Factory (With The Devil)","John (With The Devil)","This Age (With The Devil)"]
  },
};

const JW_SINGLES = ["The Poor","United Health","Join ICE","Red","No Kings","Have You Ever Seen The Rain","Bugs (Single)","War Isn't Murder (Single)"];

const JW_THEMES = [
  { name: "War & Violence",          color: "#c0392b", words: ["war","murder","bomb","kill","dead","death","blood","soldiers","casualties","veteran","bullets","weapon","military","fight","fighting","genocide","sacrifice","violence"] },
  { name: "Corporate Power & Greed", color: "#e67e22", words: ["money","banks","corporate","company","corporation","profit","ceo","equity","private","greed","rich","wealth","cost","pay","paid","payola","dupont","unitedhealth","walmart","capitalism"] },
  { name: "Class & Poverty",         color: "#8e44ad", words: ["poor","poverty","work","workers","wages","jobs","factory","class","lunch","benefits","loan","rent","cheap","struggling","bootstrap","bootstraps","slaves","slavery"] },
  { name: "Government & Politics",   color: "#2980b9", words: ["government","politics","political","trump","republican","democrat","flag","law","congress","vote","election","president","authority","policy","ice","nation","state","power","rule"] },
  { name: "Health & Body",           color: "#27ae60", words: ["health","cancer","fentanyl","drug","drugs","sick","disease","fat","obesity","medical","hospital","care","cure","pill","xanax","mental","depression","pain","body"] },
  { name: "Nature & Environment",    color: "#16a085", words: ["tree","trees","bugs","bug","insects","whales","whale","squirrels","turtles","water","earth","nature","environment","ocean","field","forest","creek","river","leaves","autumn","chemicals"] },
  { name: "America & Identity",      color: "#d35400", words: ["america","american","country","home","arkansas","arkansaw","land","freedom","dream","flag","people","nation","community","town","south","ozark"] },
  { name: "Love & Connection",       color: "#e91e8c", words: ["love","loving","heart","hold","care","together","family","mother","friend","people","connection","feel","feeling","lonely","alone","you","miss","need"] },
];

const JW_ARC_NOTES = {
  "War & Violence": "Hells Welles opens the catalog with war as its dominant lens \u2014 War Isn't Murder is his most widely shared song. The theme recurs across every album but shifts register by Middle and Devil's Den, where 'War is a God' moves from reportage to theology. Violence in Welles is almost always systemic, not personal.",
  "Corporate Power & Greed": "The most consistent thread in his catalog. From Payola (media) to DuPont (chemicals) to United Health (insurance) to Walmart (retail) \u2014 he names names. Naming names is a key part of his method: he doesn't say 'corporations,' he says which ones. This specificity is where his protest tradition diverges from vague folk anger.",
  "Class & Poverty": "The Poor is his most personal class statement. Boot Straps and Slaves are his most bitter. The Saddest Factory (Devil's Den) shows the theme maturing \u2014 moving from sarcasm to elegy. Working people aren't just a subject, they're his people. He had the reduced lunch. He says so.",
  "Government & Politics": "Peaks sharply with Hells Welles (Trump Trailers, Boot Straps, The Olympics) and resurges with Join ICE. His politics are harder to pin than they look \u2014 he criticizes both parties, all institutions. By Pilgrim and Devil's Den he's less topical and more philosophical about power itself.",
  "Health & Body": "Cancer, Fentanyl, Fat, Depression, God Abraham & Xanax, United Health \u2014 health is a multi-album obsession. His angle is always structural: the system is designed to make you sick and then profit from your sickness. Depression is the one inward health song \u2014 and it's notably quieter than the others.",
  "Nature & Environment": "Concentrated in All Creatures Great and Small (his lightest, most playful album) but threads through everything. Wild Onions, Grapes of Wrath, Autumn. He's an Ozark kid \u2014 nature isn't metaphor for him, it's home. DuPont and Whales flip the register: nature as victim of the same systems he critiques everywhere else.",
  "America & Identity": "He is obsessively American even when he's criticizing America. See Arkansaw is the purest statement. America Girl (Devil's Den) is his most complex \u2014 love letter and indictment simultaneously. Arkansas grounds him the way Pennsylvania grounds Hunter Root: he always knows where he comes from.",
  "Love & Connection": "His least developed theme on paper, most developed in sound. Middle album is where love language peaks \u2014 Horses, Certain, Why Don't You Love Me. It's not romantic love so much as love as a political act. 'Singing this song about loving all the people you've come to hate' is as close to a manifesto as he has.",
};

const JW_JUICE_FORMULA = {
  intro: "Welles writes outward, not inward. Where most folk singers locate the wound inside themselves, he locates it in the system. Corporate power and class language appear in more songs than almost any other theme \u2014 he names the companies, names the policies, names the politicians. That specificity is the intimacy.",
  formula: "The surprise in the data: Love & Connection is quieter than you'd expect but never absent. The joke is that he's writing love songs \u2014 love songs to poor people, to Arkansaw, to trees, to the dead. The rage is just love with nowhere else to go.",
};

// ============================================================
//  UNIFIED ARTIST DATA STRUCTURE
// ============================================================
const ARTISTS = {
  "Hunter Root": {
    LYRICS: HR_LYRICS,
    DISCOGRAPHY: HR_DISCOGRAPHY,
    SINGLES: HR_SINGLES,
    THEMES: HR_THEMES,
    ARC_NOTES: HR_ARC_NOTES,
    JUICE_FORMULA: HR_JUICE_FORMULA,
    accent: "#c9813a",
    bg: "#1a1612",
    bgPanel: "#231f1a",
    bgPanelHeader: "#2a251f",
    bgDeep: "#1e1a14",
    border: "#3a3228",
    textPrimary: "#e2d9c5",
    textSecondary: "#9a8870",
    textMuted: "#4a4030",
    textDim: "#5a5040",
    textLabel: "#c0b49a",
    textSubtle: "#6a5f4e",
    textArc: "#9a8f7e",
    textTimeline: "#7a6f5e",
    btnInactive: "#2e2922",
    juiceEmoji: "\uD83C\uDF4A",
    yearRange: "2018\u20132025",
    albumLabel: "6 Solo Albums",
    searchHints: "home \u00B7 devil \u00B7 brother \u00B7 fire \u00B7 dark \u00B7 pain \u00B7 run \u00B7 soul \u00B7 mind",
  },
  "Jesse Welles": {
    LYRICS: JW_LYRICS,
    DISCOGRAPHY: JW_DISCOGRAPHY,
    SINGLES: JW_SINGLES,
    THEMES: JW_THEMES,
    ARC_NOTES: JW_ARC_NOTES,
    JUICE_FORMULA: JW_JUICE_FORMULA,
    accent: "#b84a4a",
    bg: "#0a1520",
    bgPanel: "#111f2a",
    bgPanelHeader: "#162430",
    bgDeep: "#0e1a22",
    border: "#1a3040",
    textPrimary: "#cde0ee",
    textSecondary: "#5a7080",
    textMuted: "#2a4050",
    textDim: "#3a5060",
    textLabel: "#9ab0c8",
    textSubtle: "#3a5060",
    textArc: "#7a9aaa",
    textTimeline: "#5a7080",
    btnInactive: "#162430",
    juiceEmoji: "\uD83D\uDD25",
    yearRange: "2024\u20132025",
    albumLabel: "7 Albums \u00B7 2024\u20132025",
    searchHints: "poor \u00B7 war \u00B7 dead \u00B7 america \u00B7 work \u00B7 water \u00B7 love \u00B7 god \u00B7 system \u00B7 money",
  },
};

// ============================================================
//  PRE-COMPUTE DERIVED DATA PER ARTIST
// ============================================================
const PRECOMPUTED = {};
for (const [artistName, data] of Object.entries(ARTISTS)) {
  const songMaps = Object.fromEntries(Object.entries(data.LYRICS).map(([t,l])=>[t,buildMap(l)]));
  const rawMap = buildRawMap(Object.values(songMaps));
  const presMap = buildPresenceMap(Object.values(songMaps));
  const albumThemeScores = Object.entries(data.DISCOGRAPHY).map(([album,info])=>{
    const ms = info.tracks.filter(t=>data.LYRICS[t]).map(t=>songMaps[t]);
    if(!ms.length) return {album,year:info.year,color:info.color,scores:{}};
    const pm = buildPresenceMap(ms);
    const scores = {};
    for(const th of data.THEMES) scores[th.name]=th.words.reduce((s,w)=>s+(pm[w]||0),0);
    return {album,year:info.year,color:info.color,scores};
  });
  PRECOMPUTED[artistName] = { songMaps, rawMap, presMap, albumThemeScores };
}

// ============================================================
//  COMPONENTS
// ============================================================
function WordRow({word, primary, secondary, max, label1, label2, color, theme}){
  const pct=Math.max((primary/max)*100,0.4);
  const barColor=color||theme.accent;
  return(
    <div style={{display:"flex",alignItems:"center",marginBottom:4,gap:8}}>
      <span style={{width:160,textAlign:"right",fontFamily:"monospace",fontSize:13,color:theme.textLabel,flexShrink:0}}>{word}</span>
      <div style={{flex:1,position:"relative",height:16}}>
        <div style={{height:"100%",width:`${pct}%`,minWidth:3,background:barColor,borderRadius:2}}/>
      </div>
      <span style={{fontSize:13,color:theme.accent,minWidth:28,textAlign:"right",fontWeight:"bold"}}>{primary}</span>
      <span style={{fontSize:11,color:theme.textDim,minWidth:20}}>{label1}</span>
      {secondary!==undefined&&<span style={{fontSize:11,color:theme.textMuted,minWidth:36}}>({secondary} {label2})</span>}
    </div>
  );
}

function StatBox({label,val,theme}){
  return(
    <div style={{background:theme.bgDeep,borderRadius:8,padding:"9px 12px",flex:1,minWidth:70,textAlign:"center"}}>
      <div style={{fontSize:16,color:theme.accent,fontWeight:"bold"}}>{val}</div>
      <div style={{fontSize:10,color:theme.textDim,textTransform:"uppercase",letterSpacing:1}}>{label}</div>
    </div>
  );
}

function ThemeBar({themeObj,score,maxScore,uiTheme}){
  const pct=maxScore?Math.max((score/maxScore)*100,0.4):0;
  return(
    <div style={{marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
        <span style={{fontSize:13,color:uiTheme.textLabel}}>{themeObj.name}</span>
        <span style={{fontSize:11,color:uiTheme.textSubtle}}>{score} songs</span>
      </div>
      <div style={{background:uiTheme.bgDeep,borderRadius:4,height:10,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:themeObj.color,borderRadius:4,transition:"width 0.5s"}}/>
      </div>
    </div>
  );
}

// ── SEARCH PANEL ────────────────────────────────────────────
function SearchPanel({artist}){
  const data = ARTISTS[artist];
  const pre = PRECOMPUTED[artist];
  const theme = data;
  const [query,setQuery]=useState("");
  const q=query.trim().toLowerCase().replace(/[^a-z]/g,"");

  const results=useMemo(()=>{
    if(!q||q.length<2) return [];
    const hits=[];
    for(const [album,info] of Object.entries(data.DISCOGRAPHY)){
      for(const track of info.tracks){
        if(!data.LYRICS[track]) continue;
        const count=pre.songMaps[track]?.[q]||0;
        if(count>0) hits.push({album,track,count,year:info.year,color:info.color});
      }
    }
    for(const s of data.SINGLES){
      if(!data.LYRICS[s]) continue;
      const count=pre.songMaps[s]?.[q]||0;
      if(count>0) hits.push({album:"Single",track:s,count,year:"\u2014",color:theme.textDim});
    }
    return hits.sort((a,b)=>b.count-a.count);
  },[q,artist]);

  const totalOcc=results.reduce((s,r)=>s+r.count,0);
  const catalogSize=Object.keys(data.LYRICS).length;

  return(
    <div>
      <input value={query} onChange={e=>setQuery(e.target.value)}
        placeholder={`Type any word \u2014 e.g. ${data.searchHints.split(" \u00B7 ").slice(0,4).join(", ")}...`}
        style={{width:"100%",background:theme.bgDeep,border:`1px solid ${theme.border}`,borderRadius:8,
          padding:"10px 14px",fontSize:14,color:theme.textPrimary,fontFamily:"Georgia,serif",
          boxSizing:"border-box",outline:"none"}}/>
      <div style={{marginTop:16}}>
        {q.length>=2&&(results.length===0?(
          <div style={{textAlign:"center",padding:"24px",color:theme.textDim,fontSize:13}}>"{q}" not found in any indexed song.</div>
        ):(
          <>
            <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
              <StatBox label="Songs with word" val={results.length} theme={theme}/>
              <StatBox label="Total occurrences" val={totalOcc} theme={theme}/>
              <StatBox label="% of catalog" val={Math.round(results.length/catalogSize*100)+"%"} theme={theme}/>
            </div>
            <div style={{fontSize:11,letterSpacing:2,color:theme.textMuted,textTransform:"uppercase",marginBottom:10}}>
              "{q}" appears in {results.length} song{results.length!==1?"s":""}
            </div>
            {results.map(r=>(
              <div key={r.track+r.album} style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,
                padding:"7px 10px",background:theme.bgDeep,borderRadius:6,
                borderLeft:`3px solid ${r.color}`}}>
                <div style={{flex:1}}>
                  <span style={{fontSize:13,color:theme.textPrimary}}>{r.track}</span>
                  <span style={{fontSize:10,color:theme.textDim,marginLeft:8}}>{r.album} \u00B7 {r.year}</span>
                </div>
                <span style={{fontSize:14,color:theme.accent,fontWeight:"bold"}}>{r.count}</span>
                <span style={{fontSize:10,color:theme.textDim,marginLeft:2}}>\u00D7</span>
                <div style={{width:50,background:theme.bgPanel,borderRadius:3,height:8,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${Math.min(r.count/Math.max(...results.map(x=>x.count))*100,100)}%`,background:r.color,borderRadius:3}}/>
                </div>
              </div>
            ))}
          </>
        ))}
        {q.length<2&&(
          <div style={{color:theme.textDim,fontSize:12,lineHeight:1.8}}>
            Search {catalogSize} indexed songs. Try: <span style={{color:theme.accent}}>{data.searchHints}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── TIMELINE PANEL ──────────────────────────────────────────
function TimelinePanel({artist}){
  const data = ARTISTS[artist];
  const pre = PRECOMPUTED[artist];
  const theme = data;
  const [focusTheme,setFocusTheme]=useState(data.THEMES[0].name);
  const themeObj=data.THEMES.find(t=>t.name===focusTheme)||data.THEMES[0];
  const albumsWithData=pre.albumThemeScores.filter(a=>Object.keys(a.scores).length>0);
  const maxScore=Math.max(...albumsWithData.map(a=>a.scores[focusTheme]||0),1);
  const barH=140;

  // Short album name helper
  const shortName=(name)=>{
    return name
      .replace("They Finally Cracked Me","Cracked Me")
      .replace("Life Inside a Wheel","Life/Wheel")
      .replace("Mimicking the Sun Like Dandelions","Mimicking")
      .replace("Skipping Stones That Sink Before They're Thrown","Skip Stones")
      .replace("All Creatures Great and Small","All Creatures")
      .replace("With The Devil","With Devil")
      .replace("Devil's Den","Devil's Den");
  };

  return(
    <div>
      <div style={{fontSize:12,color:theme.textTimeline,marginBottom:14,lineHeight:1.7}}>
        Bars show how many <em>songs per album</em> contain words in each theme. Select a theme to trace its arc {data.yearRange}.
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:20}}>
        {data.THEMES.map(t=>(
          <button key={t.name} onClick={()=>setFocusTheme(t.name)}
            style={{padding:"5px 10px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,
              background:focusTheme===t.name?t.color:theme.btnInactive,
              color:focusTheme===t.name?"#fff":theme.textSecondary,fontFamily:"Georgia,serif"}}>
            {t.name}
          </button>
        ))}
      </div>
      <div style={{background:theme.bgDeep,borderRadius:8,padding:"16px 12px",marginBottom:16}}>
        <div style={{fontSize:10,letterSpacing:2,color:theme.textMuted,textTransform:"uppercase",marginBottom:14}}>
          {focusTheme} \u2014 Songs per Album Containing Theme Words
        </div>
        <div style={{display:"flex",alignItems:"flex-end",gap:6,height:barH+50}}>
          {albumsWithData.map(a=>{
            const score=a.scores[focusTheme]||0;
            const h=Math.max((score/maxScore)*barH,2);
            return(
              <div key={a.album} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",height:barH+50}}>
                <div style={{fontSize:12,color:theme.accent,marginBottom:4,fontWeight:"bold"}}>{score>0?score:""}</div>
                <div style={{width:"100%",height:h,background:a.color,borderRadius:"3px 3px 0 0",minHeight:2,transition:"height 0.5s"}}/>
                <div style={{marginTop:6,fontSize:9,color:theme.textSubtle,textAlign:"center",lineHeight:1.3}}>{shortName(a.album)}</div>
                <div style={{fontSize:9,color:theme.textMuted}}>{a.year}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{background:theme.bgDeep,borderRadius:8,padding:14,fontSize:12,color:theme.textArc,lineHeight:1.9}}>
        <strong style={{color:themeObj.color,display:"block",marginBottom:6}}>{focusTheme} \u2014 Arc</strong>
        {data.ARC_NOTES[focusTheme]}
      </div>
    </div>
  );
}

// ── MAIN APP ────────────────────────────────────────────────
function tabStyle(active,color,theme){
  return{
    padding:"6px 12px",cursor:"pointer",fontSize:11,letterSpacing:1,textTransform:"uppercase",
    background:active?(color||theme.accent):"transparent",
    color:active?"#fff":theme.textDim,
    border:"none",borderRadius:5,fontFamily:"Georgia,serif",fontWeight:active?"bold":"normal"
  };
}

export default function App(){
  const [artist,setArtist]=useState("Hunter Root");

  const data = ARTISTS[artist];
  const pre = PRECOMPUTED[artist];
  const theme = data;

  const defaultAlbum = artist==="Hunter Root"?"Arkansas":"Hells Welles";
  const defaultTrack = artist==="Hunter Root"?"Town Rat Heathen":"War Isn't Murder";

  const [selAlbum,setSelAlbum]=useState(defaultAlbum);
  const [selTrack,setSelTrack]=useState(defaultTrack);
  const [panel,setPanel]=useState("song");
  const [minCount,setMinCount]=useState(2);
  const [showAll,setShowAll]=useState(false);

  // Reset state on artist switch
  const switchArtist=(name)=>{
    if(name===artist) return;
    setArtist(name);
    const d=ARTISTS[name];
    const defAlbum=name==="Hunter Root"?"Arkansas":"Hells Welles";
    const defTrack=name==="Hunter Root"?"Town Rat Heathen":"War Isn't Murder";
    setSelAlbum(defAlbum);
    setSelTrack(defTrack);
    setPanel("song");
    setMinCount(2);
    setShowAll(false);
  };

  const info=data.DISCOGRAPHY[selAlbum];
  const aColor=info?info.color:theme.accent;
  const isWordMap=["song","album","all"].includes(panel);

  const songMap=useMemo(()=>data.LYRICS[selTrack]?pre.songMaps[selTrack]:null,[selTrack,artist]);
  const albumData=useMemo(()=>{
    if(!info) return null;
    const ms=info.tracks.filter(t=>data.LYRICS[t]).map(t=>pre.songMaps[t]);
    if(!ms.length) return null;
    return {presence:buildPresenceMap(ms),raw:buildRawMap(ms)};
  },[selAlbum,artist]);
  const allData=useMemo(()=>({presence:pre.presMap,raw:pre.rawMap}),[artist]);

  const sorted=useMemo(()=>{
    if(!isWordMap) return [];
    if(panel==="song"){
      if(!songMap) return [];
      return Object.entries(songMap).filter(([w,c])=>c>=minCount&&!STOPWORDS.has(w)&&w.length>2).sort((a,b)=>b[1]-a[1]);
    }
    if(panel==="album"){
      if(!albumData) return [];
      return Object.entries(albumData.presence).filter(([w,c])=>c>=minCount&&!STOPWORDS.has(w)&&w.length>2).map(([w,c])=>[w,c,albumData.raw[w]||0]).sort((a,b)=>b[1]-a[1]);
    }
    return Object.entries(allData.presence).filter(([w,c])=>c>=minCount&&!STOPWORDS.has(w)&&w.length>2).map(([w,c])=>[w,c,allData.raw[w]||0]).sort((a,b)=>b[1]-a[1]);
  },[panel,songMap,albumData,allData,minCount,artist]);

  const displayed=showAll?sorted:sorted.slice(0,50);
  const maxPrimary=(sorted[0]?.[1])||1;

  const juiceScores=useMemo(()=>data.THEMES.map(t=>({...t,
    score:t.words.reduce((s,w)=>s+(pre.presMap[w]||0),0)
  })).sort((a,b)=>b.score-a.score),[artist]);
  const maxJuice=juiceScores[0]?.score||1;
  const topCross=useMemo(()=>Object.entries(pre.presMap).filter(([w])=>!STOPWORDS.has(w)&&w.length>3).sort((a,b)=>b[1]-a[1]).slice(0,24),[artist]);

  const loadedSongs=Object.keys(data.LYRICS).length;
  const totalIndexed=Object.values(data.LYRICS).reduce((s,l)=>s+tokenize(l).length,0);

  const totalWords=songMap&&panel==="song"?Object.values(songMap).reduce((a,b)=>a+b,0):
    panel==="album"&&albumData?Object.values(albumData.raw).reduce((a,b)=>a+b,0):
    Object.values(allData.raw).reduce((a,b)=>a+b,0);
  const uniqueWords=panel==="song"?(songMap?Object.keys(songMap).length:0):
    panel==="album"&&albumData?Object.keys(albumData.raw).length:
    Object.keys(allData.raw).length;

  return(
    <div style={{minHeight:"100vh",background:theme.bg,color:theme.textPrimary,fontFamily:"Georgia,serif",padding:"18px 14px",transition:"background 0.4s"}}>
      <div style={{maxWidth:740,margin:"0 auto"}}>

        {/* ── ARTIST SELECTOR ── */}
        <div style={{display:"flex",justifyContent:"center",gap:0,marginBottom:18}}>
          {Object.keys(ARTISTS).map(name=>{
            const isActive=name===artist;
            const a=ARTISTS[name];
            return(
              <button key={name} onClick={()=>switchArtist(name)}
                style={{
                  padding:"10px 28px",cursor:"pointer",fontSize:14,letterSpacing:2,
                  textTransform:"uppercase",fontFamily:"Georgia,serif",fontWeight:isActive?"bold":"normal",
                  background:isActive?a.accent:"transparent",
                  color:isActive?"#fff":a.accent,
                  border:`2px solid ${a.accent}`,
                  borderRadius:name==="Hunter Root"?"8px 0 0 8px":"0 8px 8px 0",
                  transition:"all 0.3s",
                  opacity:isActive?1:0.6,
                }}>
                {name}
              </button>
            );
          })}
        </div>

        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:11,letterSpacing:3,color:theme.textMuted,textTransform:"uppercase",marginBottom:4}}>{artist} \u00B7 Lyric Intelligence Engine</div>
          <h1 style={{fontSize:20,fontWeight:"normal",margin:0,color:theme.textPrimary}}>Word Map, Theme Analysis & Timeline</h1>
          <div style={{fontSize:11,color:theme.textMuted,marginTop:5}}>{loadedSongs} songs \u00B7 {totalIndexed.toLocaleString()} words indexed \u00B7 {data.yearRange}</div>
        </div>

        {/* Discography */}
        <div style={{background:theme.bgPanel,borderRadius:10,border:`1px solid ${theme.border}`,marginBottom:16,overflow:"hidden"}}>
          <div style={{padding:"8px 14px",background:theme.bgPanelHeader,borderBottom:`1px solid ${theme.border}`,fontSize:10,letterSpacing:2,color:theme.textMuted,textTransform:"uppercase"}}>{data.albumLabel}</div>
          {Object.entries(data.DISCOGRAPHY).map(([album,ai])=>{
            const loaded=ai.tracks.filter(t=>data.LYRICS[t]).length;
            const isAct=album===selAlbum;
            return(
              <div key={album} onClick={()=>{setSelAlbum(album);setSelTrack(ai.tracks.find(t=>data.LYRICS[t])||ai.tracks[0]);setPanel("song");setShowAll(false);}}
                style={{padding:"8px 14px",cursor:"pointer",borderBottom:`1px solid ${theme.bg}`,background:isAct?theme.bgPanelHeader:"transparent",borderLeft:`3px solid ${isAct?ai.color:"transparent"}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <span style={{fontSize:13,color:isAct?theme.textPrimary:theme.textSecondary}}>{album}</span>
                  <span style={{marginLeft:8,fontSize:10,color:theme.textMuted,fontStyle:"italic"}}>{loaded}/{ai.tracks.length} loaded</span>
                </div>
                <span style={{fontSize:11,color:theme.textMuted}}>{ai.year}</span>
              </div>
            );
          })}
          <div style={{padding:"8px 14px",background:theme.bgDeep,borderLeft:`3px solid ${theme.textDim}`}}>
            <span style={{fontSize:11,color:theme.textSubtle}}>Singles</span>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:7}}>
              {data.SINGLES.map(s=>(
                <button key={s} onClick={()=>{setSelTrack(s);setPanel("song");setShowAll(false);}}
                  style={{background:selTrack===s?theme.textDim:theme.btnInactive,color:selTrack===s?"#fff":theme.textSecondary,border:"none",borderRadius:6,padding:"4px 10px",fontSize:11,cursor:"pointer",fontFamily:"Georgia,serif"}}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Track Picker */}
        {info&&(
        <div style={{background:theme.bgPanel,borderRadius:10,border:`1px solid ${theme.border}`,marginBottom:16,overflow:"hidden"}}>
          <div style={{padding:"8px 14px",background:theme.bgPanelHeader,borderBottom:`1px solid ${theme.border}`,fontSize:10,letterSpacing:2,color:theme.textMuted,textTransform:"uppercase"}}>{selAlbum} \u2014 {info.year}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,padding:12}}>
            {info.tracks.map(track=>{
              const has=!!data.LYRICS[track];
              const act=track===selTrack;
              return(
                <button key={track} onClick={()=>{if(has){setSelTrack(track);setPanel("song");setShowAll(false);}}}
                  style={{background:act?aColor:has?theme.btnInactive:theme.bgDeep,color:act?"#fff":has?theme.textSecondary:theme.textMuted,border:has?"none":`1px dashed ${theme.border}`,borderRadius:6,padding:"5px 10px",fontSize:11,cursor:has?"pointer":"default",fontFamily:"Georgia,serif",fontWeight:act?"bold":"normal",opacity:has?1:0.5}}>
                  {track}{!has&&<span style={{fontSize:9,marginLeft:3}}>\u25E6</span>}
                </button>
              );
            })}
          </div>
          <div style={{padding:"2px 12px 10px",fontSize:9,color:theme.textMuted}}>\u25CF loaded &nbsp; \u25E6 pending</div>
        </div>
        )}

        {/* Tabs */}
        <div style={{display:"flex",gap:5,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
          <button style={tabStyle(panel==="song",aColor,theme)} onClick={()=>{setPanel("song");setShowAll(false);}}>Song Map</button>
          <button style={tabStyle(panel==="album",aColor,theme)} onClick={()=>{setPanel("album");setShowAll(false);}}>Album Map</button>
          <button style={tabStyle(panel==="all",aColor,theme)} onClick={()=>{setPanel("all");setShowAll(false);}}>All Songs</button>
          <button style={tabStyle(panel==="juice",theme.accent,theme)} onClick={()=>setPanel("juice")}>{data.juiceEmoji} The Juice</button>
          <button style={tabStyle(panel==="timeline",theme.accent,theme)} onClick={()=>setPanel("timeline")}>{"\uD83D\uDCC8"} Timeline</button>
          <button style={tabStyle(panel==="search",theme.accent,theme)} onClick={()=>setPanel("search")}>{"\uD83D\uDD0D"} Search</button>
          {isWordMap&&(
            <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:5}}>
              <label style={{fontSize:10,color:theme.textMuted}}>{panel==="song"?"min count:":"min songs:"}</label>
              <select value={minCount} onChange={e=>setMinCount(+e.target.value)} style={{background:theme.bg,color:theme.textSecondary,border:`1px solid ${theme.border}`,borderRadius:4,padding:"2px 5px",fontSize:11}}>
                {[1,2,3,4,5,6,8,10].map(n=><option key={n} value={n}>{n}+</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Main Panel */}
        <div style={{background:theme.bgPanel,borderRadius:10,border:`1px solid ${theme.border}`,overflow:"hidden"}}>
          <div style={{padding:"8px 14px",background:theme.bgPanelHeader,borderBottom:`1px solid ${theme.border}`,fontSize:10,letterSpacing:2,color:theme.textMuted,textTransform:"uppercase"}}>
            {panel==="song"    && `"${selTrack}" \u2014 Raw Word Frequency`}
            {panel==="album"   && `${selAlbum} \u2014 Songs Containing Word (+ total occurrences)`}
            {panel==="all"     && `Full Catalog \u2014 Songs Containing Word (+ total occurrences)`}
            {panel==="juice"   && "The Juice \u2014 Theme Presence Across Catalog"}
            {panel==="timeline"&& "Timeline \u2014 Theme Song Count by Album"}
            {panel==="search"  && "Word Search \u2014 Find Any Word Across All Songs"}
          </div>
          <div style={{padding:16}}>

            {panel==="search"  && <SearchPanel artist={artist}/>}
            {panel==="timeline"&& <TimelinePanel artist={artist}/>}

            {panel==="juice"&&(
              <div>
                <div style={{fontSize:12,color:theme.textTimeline,marginBottom:16,lineHeight:1.8}}>
                  Bars show <strong style={{color:theme.accent}}>how many songs</strong> contain theme-related words \u2014 normalized across {loadedSongs} indexed songs.
                </div>
                <div style={{marginBottom:22}}>
                  {juiceScores.map(t=><ThemeBar key={t.name} themeObj={t} score={t.score} maxScore={maxJuice} uiTheme={theme}/>)}
                </div>
                <div style={{background:theme.bgDeep,borderRadius:8,padding:14,marginBottom:16}}>
                  <div style={{fontSize:10,letterSpacing:2,color:theme.textMuted,textTransform:"uppercase",marginBottom:10}}>Most Pervasive Words \u2014 Songs Containing</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                    {topCross.map(([word,count])=>(
                      <div key={word} style={{background:theme.bgPanelHeader,borderRadius:6,padding:"4px 10px",border:`1px solid ${theme.border}`,fontSize:12}}>
                        <span style={{color:theme.accent,fontWeight:"bold"}}>{word}</span>
                        <span style={{fontSize:10,color:theme.textMuted,marginLeft:5}}>{count} songs</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{background:theme.bgDeep,borderRadius:8,padding:14,fontSize:12,color:theme.textArc,lineHeight:1.9}}>
                  <strong style={{color:theme.accent,display:"block",marginBottom:8}}>The Juice Formula</strong>
                  <p style={{margin:"0 0 10px"}}>{data.JUICE_FORMULA.intro}</p>
                  <p style={{margin:0}}><strong style={{color:theme.accent}}>{data.JUICE_FORMULA.formula.startsWith("The Formula")||data.JUICE_FORMULA.formula.startsWith("The surprise")?"":""}</strong>{data.JUICE_FORMULA.formula}</p>
                </div>
              </div>
            )}

            {isWordMap&&(
              <>
                {sorted.length===0?(
                  <div style={{textAlign:"center",padding:"28px 14px",color:theme.textMuted,fontSize:13}}>
                    {panel==="song"&&!songMap?"Select a highlighted track.":"No words meet the current filter \u2014 try lowering the minimum."}
                  </div>
                ):(
                  <>
                    {panel!=="song"&&(
                      <div style={{fontSize:10,color:theme.textDim,marginBottom:12,lineHeight:1.7}}>
                        <span style={{color:theme.accent,fontWeight:"bold"}}>Bold number</span> = songs containing word
                        &nbsp;\u00B7&nbsp;
                        <span style={{color:theme.textMuted}}>(parenthetical)</span> = total occurrences across those songs
                      </div>
                    )}
                    <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
                      {panel==="song"?(
                        <>
                          <StatBox label="Total Words" val={totalWords.toLocaleString()} theme={theme}/>
                          <StatBox label="Unique Words" val={uniqueWords.toLocaleString()} theme={theme}/>
                          <StatBox label="Showing" val={displayed.length} theme={theme}/>
                          <StatBox label="Lexical Richness" val={(uniqueWords/totalWords*100).toFixed(0)+"%"} theme={theme}/>
                        </>
                      ):(
                        <>
                          <StatBox label={panel==="album"?"Songs in Album":"Songs in Catalog"} val={panel==="album"&&info?info.tracks.filter(t=>data.LYRICS[t]).length:loadedSongs} theme={theme}/>
                          <StatBox label="Unique Words" val={uniqueWords.toLocaleString()} theme={theme}/>
                          <StatBox label="Showing" val={displayed.length} theme={theme}/>
                          <StatBox label="Total Words" val={totalWords.toLocaleString()} theme={theme}/>
                        </>
                      )}
                    </div>
                    {displayed.map(entry=>{
                      if(panel==="song"){
                        const [word,count]=entry;
                        return <WordRow key={word} word={word} primary={count} max={maxPrimary} label1={"\u00D7"} theme={theme}/>;
                      } else {
                        const [word,songCt,rawCt]=entry;
                        return <WordRow key={word} word={word} primary={songCt} secondary={rawCt} max={maxPrimary} label1="songs" label2={"\u00D7"} theme={theme}/>;
                      }
                    })}
                    {sorted.length>50&&(
                      <button onClick={()=>setShowAll(!showAll)} style={{marginTop:12,background:"transparent",color:theme.accent,border:`1px solid ${theme.accent}`,borderRadius:6,padding:"6px 16px",cursor:"pointer",fontSize:11,fontFamily:"Georgia,serif",width:"100%"}}>
                        {showAll?`\u25B2 Show top 50`:`\u25BC Show all ${sorted.length} words`}
                      </button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <div style={{textAlign:"center",marginTop:12,fontSize:9,color:theme.textMuted}}>
          {artist} \u00B7 Lyric Intelligence \u00B7 {loadedSongs} songs \u00B7 {totalIndexed.toLocaleString()} words \u00B7 {data.yearRange}
        </div>
      </div>
    </div>
  );
}
