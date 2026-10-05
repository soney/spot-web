<!-- Source PDF SHA-256: b18316dcd1297682e5fc7820b3ff900a17449848ae9662bc89853b10aa67cad2 -->

<a id="page-1"></a>

# Explore, Create, Annotate: Designing Digital Drawing Tools with Visually Impaired People

[Source PDF](https://from.so/assets/pdfs/pandey-explore-create-annotate-chi2020.pdf) · [Publisher page](https://doi.org/10.1145/3313831.3376349)

Maulishree Pandey<sup>1</sup>, Hariharan Subramonyam<sup>1</sup>, Brooke Sasia<sup>2</sup>, Steve Oney<sup>1</sup>, Sile O’Modhrain<sup>1</sup>

<sup>1</sup>University of Michigan, Ann Arbor, MI {maupande, harihars, soney, sileo}@umich.edu

<sup>2</sup>California Polytechnic State University San Luis Obispo, CA asasia@calpoly.edu

> Permission to make digital or hard copies of all or part of this work for personal or classroom use is granted without fee provided that copies are not made or distributed for profit or commercial advantage and that copies bear this notice and the full citation on the first page. Copyrights for components of this work owned by others than the author(s) must be honored. Abstracting with credit is permitted. To copy otherwise, or republish, to post on servers or to redistribute to lists, requires prior specific permission and/or a fee. Request permissions from permissions@acm.org. CHI ’20, April 25–30, 2020, Honolulu, HI, USA. © 2020 Copyright is held by the owner/author(s). Publication rights licensed to ACM. ACM ISBN 978-1-4503-6708-0/20/04 ...$15.00. http://dx.doi.org/10.1145/3313831.3376349

## ABSTRACT

People often use text in their drawings to communicate their ideas. For visually impaired people, adding textual information to tactile graphics is challenging. Labeling in braille is a laborious process and clutters the drawings. Audio labels provide an alternative way to add text. However, digital drawing tools for visually impaired people have not examined the use of audio for creating labels. We conducted a study comprising three tasks with 11 visually impaired adults. Our goal was to understand how participants explored and created labeled tactile graphics (both braille and audio), and their interaction preferences. We find that audio labels were quicker to use and easier to create. However, braille labels enabled flexible exploration strategies. We also find that participants preferred multimodal interaction commands, and report hand postures and movements observed during the drawing process for designing recognizable interactions. Based on our findings, we derive design implications for digital drawing tools.

## Author Keywords

Tactile graphics; Drawing Applications; Accessibility; Blind

## CCS Concepts

•Human-centered computing → Accessibility systems and tools; Accessibility technologies;

## INTRODUCTION

Graphics such as diagrams, visualizations, and charts combine visual and textual information. These can represent ideas that are hard to explain with text alone and are particularly useful in educational and professional contexts. For people with visual impairments, these graphics are rendered in a tactile format with the text usually represented in braille. Students with visual impairments have indicated that they find tactile graphics to be useful in coursework and access to graphics [makes them feel more included in classrooms \[42\]. Interviews](<#page-12>) with students and instructors inform us that students like making their own tactile graphics and feel more motivated when they are involved in the creation process \[38, 5\]. However, labeling the graphics is a challenge for people with visual impairments. Adding metadata such as labels, titles, and descriptions in braille is a lengthy process. The text has to be prepared separately using analog tools such as a stylus[1](<#page-1>) or embossed on braillable sheets and pasted on graphics for labeling. Too many braille labels clutter the graphic and make it difficult to discriminate between tactile elements. The National Federation of the Blind (NFB) noted in 2013 that unavailability of simple devices for creating and editing tactile drawings has [prevented students from creating their own graphics \[2\].](<#page-11>)

> [<sup>1</sup>http://accessiblegraphics.org/formats/tactile/](<http://accessiblegraphics.org/formats/tactile/braille-labels/>) [braille-labels/](<http://accessiblegraphics.org/formats/tactile/braille-labels/>)

![Figure 1. A participant’s tactile map of a park, drawn as raised outlines on transparent film. Several locations are marked with braille label strips and pieces of textured paper tape for audio labels, so the participant can distinguish the two label types by touch.](../figures/pandey-explore-create-annotate-chi2020/figure-001-p001.png)

Figure 1. A tactile map of a park created by participant P6 in our study. He preferred using both braille and audio labels, and chose a differently textured tactile marker (paper tape) to represent audio information.

Audio is a potential solution for annotating tactile graphics. Many digital drawing tools already use audio as an ‘output [modality’ \[10\]. Companies like](<#page-11>) [TouchGraphics \[3\] and View-](<#page-11>) [Plus \[4\] have designed interactive](<#page-11>) tactile graphics with audio labels that are accessible by touch gestures or digital pens. However, they do not allow audio input for labeling. End-users cannot create labels in real-time when exploring a graphic or create freehand drawings and label them. So far no one has studied the needs and interaction preferences of visually impaired people to extend the functionality of digital drawing tools in this regard. We wanted to investigate this in our work. We therefore conducted a study with 11 visually impaired adults with the goal of answering two research questions: (1) What strategies are used by people with visual impairments as they explore, draw, and label tactile graphics? (2) What interaction commands do people with visual impairments prefer to create and annotate tactile graphics for digital use?

<a id="page-2"></a>

Answering the first question requires understanding how braille labels are used during the creation and exploration of tactile graphics. The salient behaviors possible with braille should be supported by audio. Also, observing people’s finger movements during creation and exploration is critical to designing recognizable interactions. The second research question can help identify users’ preferences for interactivity with audio labels as visually impaired people have markedly differ- [ent interaction preferences from sighted people \[20\].](<#page-11>)

Tasks in our study focused on observing participants’ exploration and creation of labeled tactile graphics and eliciting preferred interaction commands. We found that audio labels were significantly quicker for finding information on graphics. However, braille labels afforded different strategies to access the information. This provides opportunities to think about organizing and presenting information with the audio modality. Our study also revealed that participants preferred a combination of screen reader gestures and short voice commands to interact with audio information. They wanted the audio labels to be easily discoverable and represented in a way that was easy to identify. Finally, we noted specific hand postures and finger movements that should be considered in designing recognizable interactions for digital drawing tools.

## RELATED WORK

We build on prior work on the analysis of hand movements, tactile graphics tools for blind users, and eliciting user input.

### Tactile Perception and Hand Movements

Lederman and Klatzky [\[24, 25\]](<#page-12>) provided the ‘exploratory procedures’ (EP) framework for classification of finger movements on physical objects. They found that participants performed different patterns of movements to learn object properties such as shape, texture, and temperature. Visually impaired people also tend to perform less asynchronous ‘bimanual exploration’ of drawings and are likely to use their braille reading hand for exploration as opposed to blindfolded sighted participants, who tend to use [both hands simultaneously \[7\].](<#page-11>) It is important to examine how these behaviors change when information is present on the drawings.

People with visual impairments recognized graphics more quickly and accurately compared to sighted participants when semantic information [was provided about the drawings \[32\].](<#page-12>) Brock et al. [\[11,](<#page-11>) [12\] found that participants took significantly](<#page-11>) less time to memorize a map with audio labels as opposed to a map with braille labels. We build on these findings by looking at quantitative and qualitative differences in use of audio and braille labels during the exploration of tactile graphics.

There is limited work reporting on the behavior of visually impaired people when they are creating and annotating tactile graphics. Studies have found that visually impaired people tend to depict drawings using ‘outlines’, using lines to rep- [resent ideas, similar to most sighted people \[21, 22\]. Kamel](<#page-11>) [and Landay \[18\] studied how](<#page-11>) visually impaired adults carried out freehand tactile drawing. They observed that participants tended to anchor one hand to a point while moving the other hand. This helped them track lengths, angles and curvatures with limited accuracy. Vinter et al. [\[40\] analyzed](<#page-12>) the exploratory procedures used to create two-dimensional representations of physical objects. They found a strong correlation between the systematic strategies used to explore the object and the ones used during the creation of its tactile drawing. However, these studies have focused on freehand drawing. In our study, we not only examine how people draw but also seek to understand their labeling preferences. This analysis is important because people combine graphics and text to represent their ideas. Our findings will help researchers develop interactive drawing tools that are more suited to the needs of visually impaired people.

### Tactile Graphics Tools in HCI

Prior work in HCI has studied use of braille in non-graphical [contexts \[31, 30\]. With regard to tactile graphics, most inter-](<#page-12>) active systems use speech output to inform blind users of the available information. Baker et [al. \[6\] created](<#page-11>) a smartphone application to scan QR codes on tactile graphics, and read out labels on the graphic. The system was designed and evaluated with people who did not know [Braille. AccessLens \[19\]](<#page-11>) used computer-vision based finger tracking and read out information about tactile graphics (or non-tactile graphics) using [synthetic speech. Tactile Graphics Helper \[15\] was](<#page-11>) similarly computer-vision powered, and tracked students’ fingers and gave them clarifying information via speech.

Researchers have also built systems to support the creation of drawings. IC2D, a digital drawing system, provided audio feedback to visually impaired users so that they could draw directly on computer screens without requiring special tactile [technologies \[17\].](<#page-11>) Similarly, AudioDraw is a touchscreen based drawing tool used for creation of diagrams on mobile [devices \[16\]. A recent paper recommended that](<#page-11>) any drawing tool for the blind should provide continuous tactile feedback, and be compatible with common assistive [technologies \[9\].](<#page-11>) [Researchers have therefore used pin-matrix tactile displays \[8\]](<#page-11>) to create a tactile representation of digital information. However, all of these systems use speech for output purposes only. They do not allow users to annotate or add information. Use of speech for annotating tactile drawings has received limited attention. The only example is TDraw, which recommends the use [of speech input for adding labels \[23\]. However,](<#page-12>) the system was not designed with input from end-users.

### Elicitation of User Input

<a id="page-3"></a>

Involving users in design of interactions has led to useful insights about their preferences. Epps et al.’s [\[13\] study showed](<#page-11>) that participants preferred to use their index finger for most interactions on tabletop surfaces. Wobbrock et al. [\[41\] presented](<#page-12>) subjects with referents—descriptions of the intended effect of their actions—and asked them to invent gestures that are likely to produce these effects. Based on participants’ input, they developed a user-defined gesture set for touch surfaces. Mignot et al. [\[26\]](<#page-12>) examined how subjects used combinations of speech and gestures to carry out predefined tasks. Their study showed that subjects preferred multimodality as opposed to speech or gesture-only interactions. However, subjects also used complex speech commands since use of spontaneous speech was allowed. This was often unintelligible for systems. [A follow-up study \[34\] compared the effect of using](<#page-12>) a subset of words. The study demonstrated that users created less complex speech commands with verbal constraints and it did not limit their ability to carry out the tasks successfully. Further, users progressively got more comfortable with multimodal commands and went from preferring speech-only interaction [to a multimodal interaction over time \[35\].](<#page-12>)

Based on prior research, we can argue that eliciting input from end-users is likely to lead to interactions that are easy to learn, enable execution of complex tasks, and are recognizable by the system. Engaging end-users is especially important when creating accessible systems to promote design that is based on [their gestural preferences \[20\]. Additionally, interactive tactile](<#page-11>) graphics are examples of tangible interfaces and they need to support interactions that do not conflict with the actions of blind people when they are simply [exploring the object \[39\].](<#page-12>)

## STUDY DESIGN

We conducted a study with three tasks to answer our research questions. The goals of the tasks were to (1) understand the differences in participants’ exploration behaviors with tactile graphics that had braille vs audio labels (2) elicit user-defined input for annotating the graphics using speech (3) understand participants’ strategies as they create and label the graphics.

### Participants

For the purposes of the study, ‘visual impairment’ was defined as severe reduction in vision that cannot be corrected with standard glasses or contact lenses, and that therefore requires people to rely on their tactile and auditory modalities to access information using braille and screen-readers. To be eligible, participants had to be at least 18 years old and know how to read braille. We recruited participants with the help of two organizations: the National Federation for the Blind (NFB) and the Lighthouse for the Blind of San Francisco. They shared our participation call through their network of service users. We randomly selected participants (4 female, 7 male; ages 18– 55 years) from the responses received to the participation call to achieve random sampling. The study lasted 80–90 minutes. We compensated participants for their time with $30 USD. Each participant completed all the tasks, except P11 who only completed Task 1 due to lack of time.

### Stimuli

All the tasks in the study were based on tactile maps from the [Tactile Map Open Stimulus Set (TMOSS) \[27\]. TMOSS is](<#page-12>) a set of 56 maps, broken into 7 groups of 8 maps. Each map measures 12×12 inches and represents a fictional park. Each map contains a pond and at least one walking path. Other tactile symbols on the map represent features such as restrooms, water fountains, playgrounds, picnic tables, and trashcans [(Table 1). The maps](<#page-3>) are designed to facilitate rigorous experimentation related to tactile perception, and have been used in [prior research with visually impaired people \[28\]. Parameters](<#page-12>) like distances, angles, symbol types, and configurations are highly controlled across maps. This makes the maps similar in difficulty for exploration related tasks. [Table 2 lists the](<#page-3>) different maps used in the study. Maps in Task 1 and Task 3 were modified to fit the goals of the task, as discussed below.

In Task 1, we gave fictional names to the park features. In two of the maps, we presented these names using braille. We placed the abbreviations on the map and the abbreviations along with their expanded names were listed alphabetically on a braille key, in accordance with [convention \[1\].](<#page-11>) All of the abbreviations on the map were two characters long. In the paper, ‘braille labels’ is used to refer to the abbreviations on the map. The label’s expanded name is referred to as ‘item in the key’. For the other two maps, we presented the names using audio labels. The audio label was denoted by a textured square, approximately the same size as the braille label. When participants placed their forefingers on the audio label and said ‘Label’, the label at the location was read out by the computer using synthetic speech. All fictional names on the maps were five letters long and selected through randomization from an online list of most popular names[2](<#page-3>).

<table>
  <thead>
    <tr>
      <th id="pdf-table-1020:0-47a052b8-843:0-69fdef58" scope="col">Tactile Symbol</th>
      <th id="pdf-table-1020:0-47a052b8-844:0-a0565365" scope="col">Feature</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th id="pdf-table-1020:0-47a052b8-845:0-b78cf5e8" scope="row" headers="pdf-table-1020:0-47a052b8-843:0-69fdef58">Oval</th>
      <td headers="pdf-table-1020:0-47a052b8-844:0-a0565365 pdf-table-1020:0-47a052b8-845:0-b78cf5e8">Water Fountain</td>
    </tr>
    <tr>
      <th id="pdf-table-1020:0-47a052b8-847:0-c522bf2b" scope="row" headers="pdf-table-1020:0-47a052b8-843:0-69fdef58">T</th>
      <td headers="pdf-table-1020:0-47a052b8-844:0-a0565365 pdf-table-1020:0-47a052b8-847:0-c522bf2b">Picnic Table</td>
    </tr>
    <tr>
      <th id="pdf-table-1020:0-47a052b8-849:0-3abd4278" scope="row" headers="pdf-table-1020:0-47a052b8-843:0-69fdef58">Circle</th>
      <td headers="pdf-table-1020:0-47a052b8-844:0-a0565365 pdf-table-1020:0-47a052b8-849:0-3abd4278">Trash Can</td>
    </tr>
    <tr>
      <th id="pdf-table-1020:0-47a052b8-851:0-8e8b2c5a" scope="row" headers="pdf-table-1020:0-47a052b8-843:0-69fdef58">Square</th>
      <td headers="pdf-table-1020:0-47a052b8-844:0-a0565365 pdf-table-1020:0-47a052b8-851:0-8e8b2c5a">Playground</td>
    </tr>
    <tr>
      <th id="pdf-table-1020:0-47a052b8-853:0-eaea0fda" scope="row" headers="pdf-table-1020:0-47a052b8-843:0-69fdef58">Triangle</th>
      <td headers="pdf-table-1020:0-47a052b8-844:0-a0565365 pdf-table-1020:0-47a052b8-853:0-eaea0fda">Restroom</td>
    </tr>
  </tbody>
</table>

Table 1. TMOSS Symbol Summary Table

| Pre-Tasks | Task 1 | Task 2 | Task 3 |
| --- | --- | --- | --- |
| G3-8 (Practice) | G3-6 (Braille) | G1-6 | G1-8 |
| G7-6 (Test) | G6-2 (Braille) |  |  |
|  | G4-6 (Audio) |  |  |
|  | G5-3 (Audio) |  |  |

Table 2. TMOSS Maps used in the study. Maps are numbered Gi-j, where i is group number and j is map number. For instance, G3-8 means eighth map from group three.

In Task 3, we covered the map partially to expose the top 8.5 inches of the map. This made the map’s size equal to the area of a standard 8.5×11 inch drawing sheet. This enabled the participants to copy the tactile map to scale.

### Apparatus

All tasks were conducted on a light box constructed with transparent acrylic sheets. A GoPro Hero3+ camera was placed inside the lightbox to record participants’ finger movements from below. An additional video camera with audio recording capabilities was set up on a tripod to capture finger movements and drawings from above. It recorded participants’ spoken comments and think-aloud data. Both cameras recorded at 1920×1080 resolution. Lastly, two 4×[4 ArUco markers \[36\]](<#page-12>) were placed on each participants’ index fingers. This allowed post-hoc analysis to determine coordinates of fingers, exploration strategies, unimanual vs bimanual exploration, and more[3](<#page-3>). Figure [2](<#page-4>) shows the study setup.

### Procedure

Participants performed all the tasks on the light box while seated. After explaining the study, we gave participants time to explore and familiarize themselves with the setup.

> [<sup>2</sup>http://www.babynames1000.com/five-letter/](<http://www.babynames1000.com/five-letter/>) <sup>3</sup>The analysis of data from ArUco markers was not used to report the findings in this work

<a id="page-4"></a>

![This is a set of four images. Image 1 shows a map with braille labels and the associated key used in Task 1. Image 2 shows a map with audio labels used in Task 1. Image 3 shows the map used in Task 2. Image 4 shows tactile film and stylus used in Task 3. Collectively, the four images show the lightbox (apparatus) on which maps were placed and participants performing each of the three tasks.](../figures/pandey-explore-create-annotate-chi2020/figure-002-p004.png)

Figure 2. Apparatus and stimuli used in the study. From left to right: (1) Map with braille labels and associated key used in Task 1 (2) Map with audio labels used in Task 1 (2) Map used for gesture elicitation in Task 2 (3) Tactile film and stylus used in Task 3 .

#### Pre-Tasks: Gaining Familiarity with Stimuli

Before the main tasks, participants explored the practice map (G3-8) to familiarize themselves with the stimuli. Next we presented the five [tactile symbols (Table 1) in randomized order.](<#page-3>) Participants were informed about the features these symbols represented. They were given ten seconds to explore and memorize each symbol. The tactile symbols were again presented in a randomized order to confirm participants’ knowledge. Each participant successfully and accurately named the symbols on their first try. To confirm that participants’ knowledge translated to the stimuli, map G7-6 was presented. Participants had to answer six questions about the map. These included locating the pond, two walking pathways, the cluster of water fountains, the cluster of restrooms, both picnic areas, and the trashcan. Participants were asked not to start exploring until the first question was read. This was done to prime them for future tasks. Participants were also asked to explicitly say ‘here’ upon locating the answer, thereby priming them to say the answer out loud during main tasks.

Participants were then presented with examples of the braille and audio labels they would encounter in Task 1. For braille, we presented the tactile symbol for playgrounds (squares). The playground had been given the fictional name ‘Betty Playground’. It was setup as described in the Stimuli section. For the audio label, we presented participants with the tactile symbol for water fountains (ovals). These had been named ‘Henry Water Fountains’. As described earlier, audio feedback was providing using a Wizard of Oz approach. When participants touched and said ‘Label’, the experimenter interacted with a Python script that then announced the stored label.

#### Task 1: Exploration of Tactile Graphics

Our goal in Task 1 was to understand how participants explored tactile graphics and compare their strategies for using braille and audio labels. For visually impaired users, exploration is a key part of drawing (analogous to how sighted users look at a drawing as they draw). It informs them of what they have already represented and labeled. We set up Task 1 as a within-subjects experiment. This was done because participants were likely to have varying levels of experience with tactile graphics, braille, and audio-tactile systems. Our general hypotheses were: (1) Participants would take less time to answer a question in tactile graphics with audio labels (2) They would utilize more labels in tactile maps with audio labels.

We presented each participant with 4 tactile maps: 2 with braille labels and 2 with audio labels. Participants had to answer four questions for each map (total 16 questions, 8 for the braille condition and 8 for the audio condition). We randomized the order of maps and questions across participants, with audio and braille maps presented in alternation. Prior studies on tactile perception have typically provided participants a maximum of two minutes for [exploration tasks \[33\].](<#page-12>) We followed this in our study. However, no participant exceeded this limit. Participants could read and explore as many labels as needed to answer the questions. They were told to not start exploring the map until the first question was read but then they could keep exploring between questions if they liked. After presenting all four maps, we asked participants some qualitative questions about their experiences and asked about their preferences for braille vs audio labels.

#### Task 2: Elicitation of User-Defined Input Commands

We wanted to understand participants’ preferences for interactions in Task 2. The protocol for this task was based on gesture elicitation methods used by Wobbrock et al. [\[41\] and Kane](<#page-12>) et al. [\[19\]. It was](<#page-11>) modified to elicit multimodal commands from participants for annotating tactile graphics using speech. Participants were asked to invent two interactive commands for the following 4 referents: (1) create an audio label (2) edit an audio label (3) retrieve an audio label (4) delete an audio label. We informed our participants that they could use any combination of touch gestures and speech phrases. Participants were asked to think aloud as they decided on the interactions. We asked follow-up questions to explain the choice of location of their commands, and how they would represent audio labels on the map. After finalizing the commands, they were asked to describe them, and then demonstrate them three times. The task concluded with questions on other commands or information they felt would be required for labeling tactile graphics.

#### Task 3: Creation of Tactile Graphics

<a id="page-5"></a>

The goal of this task was to observe participants’ exploration strategies and finger movements as they created and labeled the drawing. Participants had to draw the pond, path, and the largest playground on the G1-8 map. We selected these because they included geometric shapes, irregular shapes, and large strokes. Thus, we could observe participants’ drawing strategies with a range of items. We placed the tactile film and stylus on [the light box (Figure 2), and placed the map](<#page-4>) to the right. We gave participants time to become familiar with the drawing materials. We also informed them that they had to label the items in their drawing. These could be in the form of braille labels (which were printed beforehand), audio labels (using the commands participants had invented in the previous tasks), or a combination of both. After completing the drawing, participants were asked qualitative questions about their experiences with tactile graphics.

#### Post Test Questionnaire

At the end of the study, participants took a survey that asked about their experience with mobile devices, computers, and access technologies. Questions on the survey were read aloud and participants’ verbal responses were audio recorded.

### Analysis

Task 1: We transcribed participants’ responses to qualitative questions at the end of Task 1. We open coded the data to understand the advantages and disadvantages of braille and audio labels as perceived by our participants. We also annotated the video data from top camera and coded it to complement participants’ qualitative responses and understand their usage of labels. We coded the video data from bottom camera to identify the braille labels participants were reading. Braille reading was uniquely characterized in each participant’s data by movement of fingers from left to right on the label. Only movements that traversed the entire length of the label were counted as reading the label.

In studies with a small sample size, the geometric mean is considered to be the best estimate for average task time when [estimating the center of the population (the median) \[37\]. It is](<#page-12>) calculated by log-transformation of values and converting back to the original scale by exponentiating. The geometric mean is less likely to be affected by a positive skew, which is common when measuring task times as few participants may take much longer on certain tasks. We used a linear mixed-effects model to predict the geometric mean time to answer a question in each condition (audio and braille). In the model, condition was fit as a fixed effect; participants and conditions were fit as random effects. The model allowed us to account for the fact that each participant had provided multiple time measures (8 in braille, 8 in audio; thus total 176 data points) as well as allowing us to account for the individual differences among participants’ experience with braille and audio tactile graphics. We fit a Poisson regression using a generalized linear model to predict the total count of labels read in each condition. Each participant’s data provided 4 label counts in each condition(2 in braille, 2 in audio, thus total 44 data points).

Task 2: We first sorted the commands into different modalities. We calculated the Max-Consensus and Consensus-Distinct [Ratio for each referent \[29\]. Participants’ think-aloud data was](<#page-12>) transcribed and coded to understand preferences for location, performance, and familiarity with interaction commands.

Task 3: The video data from both cameras was annotated and coded to identify the static and dynamic hand movements during creation of different parts of the diagrams. These were then grouped to identify different hand postures and movements.

## FINDINGS: EXPLORATION OF TACTILE GRAPHICS

In Task 1, we found that audio labels resulted in faster performance when answering questions about items on the map. However, participants read more braille labels than audio labels. They also used different strategies for finding the answers with braille labels while audio labels allowed only one strategy.

<table>
  <thead>
    <tr>
      <th id="pdf-table-1022:0-ec65dee1-869:0-da7f6e37" scope="col">Participant</th>
      <th id="pdf-table-1022:0-ec65dee1-870:0-02f773d2" scope="col">Braille</th>
      <th id="pdf-table-1022:0-ec65dee1-871:0-bee2449a" scope="col">Audio</th>
      <th id="pdf-table-1022:0-ec65dee1-872:0-53578aba" scope="col">Preference</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th id="pdf-table-1022:0-ec65dee1-873:0-94cace0d" scope="row" headers="pdf-table-1022:0-ec65dee1-869:0-da7f6e37">P1</th>
      <td headers="pdf-table-1022:0-ec65dee1-870:0-02f773d2 pdf-table-1022:0-ec65dee1-873:0-94cace0d">35.89</td>
      <td headers="pdf-table-1022:0-ec65dee1-871:0-bee2449a pdf-table-1022:0-ec65dee1-873:0-94cace0d">23.52</td>
      <td headers="pdf-table-1022:0-ec65dee1-872:0-53578aba pdf-table-1022:0-ec65dee1-873:0-94cace0d">Braille</td>
    </tr>
    <tr>
      <th id="pdf-table-1022:0-ec65dee1-877:0-1052e162" scope="row" headers="pdf-table-1022:0-ec65dee1-869:0-da7f6e37">P2</th>
      <td headers="pdf-table-1022:0-ec65dee1-870:0-02f773d2 pdf-table-1022:0-ec65dee1-877:0-1052e162">39.09</td>
      <td headers="pdf-table-1022:0-ec65dee1-871:0-bee2449a pdf-table-1022:0-ec65dee1-877:0-1052e162">21.11</td>
      <td headers="pdf-table-1022:0-ec65dee1-872:0-53578aba pdf-table-1022:0-ec65dee1-877:0-1052e162">Braille</td>
    </tr>
    <tr>
      <th id="pdf-table-1022:0-ec65dee1-881:0-636d9136" scope="row" headers="pdf-table-1022:0-ec65dee1-869:0-da7f6e37">P3</th>
      <td headers="pdf-table-1022:0-ec65dee1-870:0-02f773d2 pdf-table-1022:0-ec65dee1-881:0-636d9136">21.09</td>
      <td headers="pdf-table-1022:0-ec65dee1-871:0-bee2449a pdf-table-1022:0-ec65dee1-881:0-636d9136">13.68</td>
      <td headers="pdf-table-1022:0-ec65dee1-872:0-53578aba pdf-table-1022:0-ec65dee1-881:0-636d9136">Braille</td>
    </tr>
    <tr>
      <th id="pdf-table-1022:0-ec65dee1-885:0-8deb3e29" scope="row" headers="pdf-table-1022:0-ec65dee1-869:0-da7f6e37">P4</th>
      <td headers="pdf-table-1022:0-ec65dee1-870:0-02f773d2 pdf-table-1022:0-ec65dee1-885:0-8deb3e29">22.07</td>
      <td headers="pdf-table-1022:0-ec65dee1-871:0-bee2449a pdf-table-1022:0-ec65dee1-885:0-8deb3e29">13.11</td>
      <td headers="pdf-table-1022:0-ec65dee1-872:0-53578aba pdf-table-1022:0-ec65dee1-885:0-8deb3e29">Audio</td>
    </tr>
    <tr>
      <th id="pdf-table-1022:0-ec65dee1-889:0-94d6a6a1" scope="row" headers="pdf-table-1022:0-ec65dee1-869:0-da7f6e37">P5</th>
      <td headers="pdf-table-1022:0-ec65dee1-870:0-02f773d2 pdf-table-1022:0-ec65dee1-889:0-94d6a6a1">15.09</td>
      <td headers="pdf-table-1022:0-ec65dee1-871:0-bee2449a pdf-table-1022:0-ec65dee1-889:0-94d6a6a1">12.55</td>
      <td headers="pdf-table-1022:0-ec65dee1-872:0-53578aba pdf-table-1022:0-ec65dee1-889:0-94d6a6a1">Braille</td>
    </tr>
    <tr>
      <th id="pdf-table-1022:0-ec65dee1-893:0-7c5c38a5" scope="row" headers="pdf-table-1022:0-ec65dee1-869:0-da7f6e37">P6</th>
      <td headers="pdf-table-1022:0-ec65dee1-870:0-02f773d2 pdf-table-1022:0-ec65dee1-893:0-7c5c38a5">20.42</td>
      <td headers="pdf-table-1022:0-ec65dee1-871:0-bee2449a pdf-table-1022:0-ec65dee1-893:0-7c5c38a5">8.99</td>
      <td headers="pdf-table-1022:0-ec65dee1-872:0-53578aba pdf-table-1022:0-ec65dee1-893:0-7c5c38a5">Audio</td>
    </tr>
    <tr>
      <th id="pdf-table-1022:0-ec65dee1-897:0-7292cf7b" scope="row" headers="pdf-table-1022:0-ec65dee1-869:0-da7f6e37">P7</th>
      <td headers="pdf-table-1022:0-ec65dee1-870:0-02f773d2 pdf-table-1022:0-ec65dee1-897:0-7292cf7b">16.01</td>
      <td headers="pdf-table-1022:0-ec65dee1-871:0-bee2449a pdf-table-1022:0-ec65dee1-897:0-7292cf7b">7.95</td>
      <td headers="pdf-table-1022:0-ec65dee1-872:0-53578aba pdf-table-1022:0-ec65dee1-897:0-7292cf7b">Both</td>
    </tr>
    <tr>
      <th id="pdf-table-1022:0-ec65dee1-901:0-d7338c95" scope="row" headers="pdf-table-1022:0-ec65dee1-869:0-da7f6e37">P8</th>
      <td headers="pdf-table-1022:0-ec65dee1-870:0-02f773d2 pdf-table-1022:0-ec65dee1-901:0-d7338c95">13.06</td>
      <td headers="pdf-table-1022:0-ec65dee1-871:0-bee2449a pdf-table-1022:0-ec65dee1-901:0-d7338c95">13.03</td>
      <td headers="pdf-table-1022:0-ec65dee1-872:0-53578aba pdf-table-1022:0-ec65dee1-901:0-d7338c95">Audio</td>
    </tr>
    <tr>
      <th id="pdf-table-1022:0-ec65dee1-905:0-7d8f7c3e" scope="row" headers="pdf-table-1022:0-ec65dee1-869:0-da7f6e37">P9</th>
      <td headers="pdf-table-1022:0-ec65dee1-870:0-02f773d2 pdf-table-1022:0-ec65dee1-905:0-7d8f7c3e">49.62</td>
      <td headers="pdf-table-1022:0-ec65dee1-871:0-bee2449a pdf-table-1022:0-ec65dee1-905:0-7d8f7c3e">15.18</td>
      <td headers="pdf-table-1022:0-ec65dee1-872:0-53578aba pdf-table-1022:0-ec65dee1-905:0-7d8f7c3e">Audio</td>
    </tr>
    <tr>
      <th id="pdf-table-1022:0-ec65dee1-909:0-e4a6b59b" scope="row" headers="pdf-table-1022:0-ec65dee1-869:0-da7f6e37">P10</th>
      <td headers="pdf-table-1022:0-ec65dee1-870:0-02f773d2 pdf-table-1022:0-ec65dee1-909:0-e4a6b59b">10.82</td>
      <td headers="pdf-table-1022:0-ec65dee1-871:0-bee2449a pdf-table-1022:0-ec65dee1-909:0-e4a6b59b">8.31</td>
      <td headers="pdf-table-1022:0-ec65dee1-872:0-53578aba pdf-table-1022:0-ec65dee1-909:0-e4a6b59b">Braille</td>
    </tr>
    <tr>
      <th id="pdf-table-1022:0-ec65dee1-913:0-73f77f66" scope="row" headers="pdf-table-1022:0-ec65dee1-869:0-da7f6e37">P11</th>
      <td headers="pdf-table-1022:0-ec65dee1-870:0-02f773d2 pdf-table-1022:0-ec65dee1-913:0-73f77f66">33.26</td>
      <td headers="pdf-table-1022:0-ec65dee1-871:0-bee2449a pdf-table-1022:0-ec65dee1-913:0-73f77f66">11.57</td>
      <td headers="pdf-table-1022:0-ec65dee1-872:0-53578aba pdf-table-1022:0-ec65dee1-913:0-73f77f66">Braille</td>
    </tr>
  </tbody>
</table>

Table 3. Geometric mean of time (in seconds) taken by each participant to answer questions in both conditions. Third column represents participants’ response to what they preferred between audio and braille labels.

### Audio is Faster but Braille is Used More

Table [3](<#page-5>) lists the geometric means of each participant for answering a question in both conditions. We noted non-overlapping confidence intervals for each condition, calculated using the results from the mixed-effects linear model. The geometric mean time for audio labels was 12.66 sec with a 95% confidence interval of \[10.05, 15.96\]; for braille labels it was 22.51 sec with a 95% confidence interval of \[16.59, 30.54\]. Thus, participants were significantly faster in answering questions with audio labels.

We analyzed if participants read the braille labels as they explored even though it was abbreviated and did not provide complete information. We counted the total number of braille labels each participant read, including repeat reads. Similarly, we counted the total number of audio labels they used, including repeat queries. The generalized linear model yielded non-overlapping 95% confidence intervals (braille: \[1.79, 2.62\], audio: \[1.32, 1.76\]), meaning that more labels were used in the braille condition. This was contrary to our hypothesis. We had expected participants to use more audio labels since it was quicker, provided full information, and didn’t require the participants to leave the map at any point. Participants talked about how they could use braille spontaneously and without having to implement any gesture at their end: “I prefer the Braille labels because with the audio one I am not sure if I am like pressing the picnic table or path for example, but I guess if I pressed it, it would still work. But with the Braille one I can just tell based on as soon as I am going past it. (P3)”.

We noted evidence for this in the video data. Participants upon discovering a braille label would read it as part of their exploration. We thus build on [prior findings \[12\].](<#page-11>) We show that while audio labels are more efficient, they may not be utilized as spontaneously during active exploration tasks.

### There are More Ways to Explore with Braille

We observed four different strategies for finding information in the braille condition: (1) Read label and find item in key (2) Read the key, then find labels (3) Only read the key (4) Use key to confirm if tactile map has been searched exhaustively. In contrast, we observed only one strategy in the audio condition i.e. find the label and perform gesture to get the information. We describe these strategies in detail below.

<a id="page-6"></a>

The most common strategy in the braille condition was locating the tactile symbol, reading its label, and visiting the key to find the full name. The items in the key were organized alphabetically according to the [conventions \[1\]. Participants](<#page-11>) would often read the first letter and move down serially until they found the letter that matched the braille label: “Just based on the letter, you know has like, for example its ‘NV’ you know ‘Oh, N!’, so you can just skim down, and ‘N’. You see on these three or whatever, how many options you have because of the letter N”(P10). Some participants would also occasionally separate their hands to locate the tactile symbols with one hand and simultaneously skim the key with the other.

In another strategy, participants worked backwards from the key. They would first memorize items on the key and then explore the map to match the braille labels with details they had memorized. This was done for questions where there were multiple potential answers to a question. For example, when asked to find the largest playground on the map, we observed P7 sequentially looking for the word “playground” on the key (there were three playgrounds in total), and memorizing their names. She then went to the map and located squares (representing playgrounds) and read their labels. Upon finding the largest cluster of squares, she stated its full name. This approach also helped her find the location of the playgrounds in relation to other tactile symbols. Another participant memorized the entire key and was able to provide names by simply reading the braille labels on the map: “In my first Braille map I decided to read the whole key first, get down all the names and then identify the location which proved to be more efficient than the way I did the second time which was find the location first then identify the name individually” (P8).

For questions that had only one possible answer, some participants chose to find the name directly from the key. They skipped locating the tactile symbol and its label on the map. They felt confirming the location was not needed when they could learn the information from the key. They shared in the real-world they would use this approach to find the name and ask for specific directions once they are at the park.

Finally, participants also used the key to figure out if they had searched the map exhaustively. For instance, P2 could not find the location of the restroom area on the map. To confirm that he had indeed searched the entire map, he read through the items on the key. He noted that the key listed “Pratt Restrooms” but he was yet to find the label “PR” on the map. He then continued his search until finding the tactile symbol for restroom and the right braille label.

Such different strategies were not observed with audio labels. Participants would locate the tactile symbol and press on the tactile marker to get the label. Occasionally, if they were unsure which tactile symbol the label represented, they would measure the distances between the label and competing tactile symbols. If still unclear, they would access multiple labels to clarify the mapping of labels to tactile symbols. Not having to find items in a key was described as ‘efficient’ by participants. But it also provided only one strategy, regardless of the information task at hand. One always had to locate the tactile symbols to learn more about them. The only way to find all the information on the map was to access all the audio labels.

### Active vs Passive Engagement with Labels

Participants discussed that braille labels allowed them to explore the map in a more independent manner: “I think that its a little bit more of an independent way to explore...to just be able to read on your own in the same way anybody else will be able to read it” (P5). They could decide between different exploration strategies (discussed above) without having to make it explicit what part of the maps they were studying. As mentioned earlier, participants’ exploration of the map in the braille condition was interspersed with reading of the labels. However, they did not always visit the key to look for the full name of the label they had just read. They read the labels spontaneously, and the decision to visit the key depended on whether they wanted to confirm details like the spelling or learn more about the label: “The advantage of braille labels is that if you are trying to memorize what different symbols mean I think it helps to have the braille...so that you can first feel the braille and then think okay, I think I know what this is and then you can look at the key and see if you’re right” (P2).

Compared to braille, audio labels were considered passive, where information was read to participants: “I didn’t have to worry about going back and forth between the key and the map or having to try to memorize the key before reading the map or vice versa. I just would click on the label, it will tell me the label, ‘Oh, good to know!’. So it was more passive”

(P8). Some participants, especially those who had learned braille later, liked the passivity and quickness afforded by audio labels: “I mean I have learned Braille in recent years, and I am still a very intermediate reader. I am pretty slow still. I mean I can still read it, it’s just harder to get through is what it is, still a slow process for me” (P6). They stated that audio was better for longer labels as braille would clutter the map. However, they also felt they could not do much when the label was mispronounced or difficult to understand. In such cases, they had to press the label multiple times to repeat the information. P11 mentioned such issues were easier to resolve with braille as they had more control interpreting details such as spelling and pronunciation: “Its the difference between reading and hearing something. Reading something is far more explicit. And you can...you can interpret it a lot more specifically” (P11).

## FINDINGS: ELICITATION OF USER DEFINED INPUT

In Task 2, total 75 interactions were formulated by participants (20 for create, 19 for edit, 18 for retrieve, 18 for delete) [4](<#page-6>). They were allowed to skip creation of a second command if they reported they could not think of alternative interactions. We found that participants commonly preferred gesture-based interactions, followed closely by multimodal interaction commands. Participants based these interactions on the gestures commonly available on smartphone screen readers.

<sup>4</sup>P7 did not design second interaction commands edit, retrieve, and delete referents; P4 did not design a second command for the retrieve referent; P9 did not design a second command for the delete referent.

<a id="page-7"></a>

### Input Modalities

The interaction commands invented by participants for each referent can be categorized into the following modalities: (1) Gestures (49.33%) (2) Gesture + Voice Commands (46.67%)

(3) Alternative Modalities (4%). For the create and edit referents, participants were also asked how they would like to input the audio label into the system. Nine out of ten participants said they would use speech to announce the label to the system. One participant said she would like to type the label using a keyboard and then use the drag gesture to move the audio label to the desired location.

#### Screen Reader Gestures were Preferred

All participants invented at least one gesture-based command for each referent. A majority of these were based on the gestures available on Android and iOS screen readers, Talk-back and Voiceover respectively. These included double taps, long press and hold, swiping, etc. Participants occasionally combined these gestures to create more complex interactions, especially for edit and delete referents. They reasoned that this would prevent accidental triggers on these referents. Examples include ‘downwards swipe followed by double tap’ to delete the audio label (P8) or a two finger triple tap to edit the audio label (P5). We noted only two gestures which were representative of real world actions, such as using the scrubbing gesture, similar to erasing, to edit the label (P2), and drawing an ‘X’, representative of crossing out, to delete the label (P6). Only one gesture was an abstraction of the tactile feature being labeled. This was invented by P10 to label the pond, where he dragged his finger as a wave and announced ‘Pond’ to demonstrate he was labeling a water body. Thus, a large majority of commands were based on gestures participants were already familiar with and used on daily basis.

#### Screen Reader Gestures + Short Voice Commands

Participants combined commonly used screen reader gestures with generic voice commands to inform the system of the desired effect. The speech commands were natural language instructions such as ‘Label This’, ‘Edit This’ and ‘Delete This’, performed simultaneously with the gesture. Participants explained that using voice commands explicitly stated their intent to the system, made the command more recognizable, and reduced the possibility of it being confused with finger movements during exploration and creation of tactile graphics. More than 50% of voice commands were two words long (mean length = 1.91 words), showing that participants preferred simple and short voice commands.

#### Alternative Interaction Commands

Only three commands did not make use of gestures or combined gestures with voice commands. P3 proposed use of buttons for the create and edit referents. She wanted to hold down the button to record her speech during labeling. For the delete referent, P3 proposed taking off the differently textured tactile marker that represented the audio label (discussed next).

### Recognizable Interactions, Discoverable Labels

Participants were most concerned about the system’s ability to recognize the tactile symbol on which the referent was being triggered. To ensure accuracy, they would perform the commands on the tactile symbol or close to it. They would also measure distances between neighboring tactile symbols to locate spaces that could be uniquely associated with only one tactile symbol. For instance, when inventing the command to label the path, many participants noted that other tactile symbols were present near the ends of the path. They felt any interaction at the ends would incorrectly label the tactile symbols in the vicinity. They traced the path to find a place that was the least busy. After a lot of exploration, many participants decided to create the audio label where the path curved. That region was deemed easiest for the system to recognize. Wobbrock et al. [\[41\] refer to this](<#page-12>) as object-centric binding of gestures i.e. performing the gesture in relation to an object’s location. Kane et al. [\[20\] have](<#page-11>) discussed how blind people prefer performing gestures close to screen edges and corners. However, both studies were carried out with regard to touchscreens. We build on these by reporting a nuanced finding about participants’ effort to find specific locations for labels in order to increase a system’s accuracy.

Another important concern was representing the audio labels such that other users can locate them amidst tactile symbols and interact with them. All participants wanted to use a differently textured tactile marker to represent the audio label. They felt this was the fastest and surest way to signal to other users that the marker represents interactive audio information. A few participants used paper tape, and placed it close to tactile labels in regions they had identified for interactions. Other participants said they would like to use braille labels to represent general and short information. If one carried out the interaction command on the braille label, only then the associated audio information should be provided.

We also noted a three-way tension between participants’ desires to (1) standardize the location of labels (2) place labels where they would be discoverable, and (3) place labels in areas which would make them recognizable for the system. Participants’ defined discoverability as easily recognizing the tactile marker during exploration. However, it also meant that one may have to explore longer to identify the marker instead of visiting a standard location each time. Lastly, the labels had to be created in locations where other tactile elements did not get accidentally labeled, or preexisting labels were not affected.

### Commonly Proposed Interactions

<a id="page-8"></a>

We calculated the max-consensus (MC) and consensus-distinct [ratio (CDR) \[29\]. MC is the percent of participants who sug-](<#page-12>) gested the most popular input technique for a referent or referent/input modality combination. A higher MC value would mean that more users agreed on a given user-defined input technique. CDR is the percent of the distinct techniques that achieved a given consensus threshold among participants. The default threshold is two, meaning at least two participants invented the same interaction command. Interaction commands with high max-consensus scores and consensus-distinct ratio can be considered highly suitable, as such scores would be indicative of strong agreement on a primary interaction with few other contender interactions. [Table 4 lists the distinct input](<#page-8>) techniques with max consensus and CDR above two for each referent. It shows that multimodal commands were highly agreed upon by users across all referents. The last column in Table 4 shows that the multimodal commands followed a pattern of pointing the index finger at location, and speaking the voice command to trigger the referent.

<table>
  <thead>
    <tr>
      <th id="pdf-table-1023:0-67adc52c-917:0-9180eb63" scope="col">Referent</th>
      <th id="pdf-table-1023:0-67adc52c-918:0-6eb51d0b" scope="col">Modality</th>
      <th id="pdf-table-1023:0-67adc52c-919:0-ac71439a" scope="col">MC</th>
      <th id="pdf-table-1023:0-67adc52c-920:0-49687078" scope="col">CDR</th>
      <th id="pdf-table-1023:0-67adc52c-921:0-7dc3265e" scope="col">Most Common Input Action</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th id="pdf-table-1023:0-67adc52c-922:0-b5e367e2" scope="row" rowspan="4" headers="pdf-table-1023:0-67adc52c-917:0-9180eb63">Create</th>
      <th id="pdf-table-1023:0-67adc52c-923:0-1e7e4a6e" scope="row" headers="pdf-table-1023:0-67adc52c-918:0-6eb51d0b pdf-table-1023:0-67adc52c-922:0-b5e367e2">Gestures + Voice (Speech I/P)</th>
      <td headers="pdf-table-1023:0-67adc52c-919:0-ac71439a pdf-table-1023:0-67adc52c-922:0-b5e367e2 pdf-table-1023:0-67adc52c-923:0-1e7e4a6e">40%</td>
      <td headers="pdf-table-1023:0-67adc52c-920:0-49687078 pdf-table-1023:0-67adc52c-922:0-b5e367e2 pdf-table-1023:0-67adc52c-923:0-1e7e4a6e">50%</td>
      <td headers="pdf-table-1023:0-67adc52c-921:0-7dc3265e pdf-table-1023:0-67adc52c-922:0-b5e367e2 pdf-table-1023:0-67adc52c-923:0-1e7e4a6e">Hold index finger at location and use voice commands (e.g. Create Label) followed by the label (4)</td>
    </tr>
    <tr>
      <th id="pdf-table-1023:0-67adc52c-927:0-a71c66d1" scope="row" headers="pdf-table-1023:0-67adc52c-918:0-6eb51d0b pdf-table-1023:0-67adc52c-922:0-b5e367e2">Gestures (Speech I/P)</th>
      <td headers="pdf-table-1023:0-67adc52c-919:0-ac71439a pdf-table-1023:0-67adc52c-922:0-b5e367e2 pdf-table-1023:0-67adc52c-927:0-a71c66d1">40%</td>
      <td headers="pdf-table-1023:0-67adc52c-920:0-49687078 pdf-table-1023:0-67adc52c-922:0-b5e367e2 pdf-table-1023:0-67adc52c-927:0-a71c66d1">33%</td>
      <td headers="pdf-table-1023:0-67adc52c-921:0-7dc3265e pdf-table-1023:0-67adc52c-922:0-b5e367e2 pdf-table-1023:0-67adc52c-927:0-a71c66d1">Hold index finger at location and say the label (4)</td>
    </tr>
    <tr>
      <th id="pdf-table-1023:0-67adc52c-931:0-9f51c640" scope="row" headers="pdf-table-1023:0-67adc52c-918:0-6eb51d0b pdf-table-1023:0-67adc52c-922:0-b5e367e2">Gestures (Keyboard I/P)</th>
      <td headers="pdf-table-1023:0-67adc52c-919:0-ac71439a pdf-table-1023:0-67adc52c-922:0-b5e367e2 pdf-table-1023:0-67adc52c-931:0-9f51c640">10%</td>
      <td headers="pdf-table-1023:0-67adc52c-920:0-49687078 pdf-table-1023:0-67adc52c-922:0-b5e367e2 pdf-table-1023:0-67adc52c-931:0-9f51c640">0%</td>
      <td headers="pdf-table-1023:0-67adc52c-921:0-7dc3265e pdf-table-1023:0-67adc52c-922:0-b5e367e2 pdf-table-1023:0-67adc52c-931:0-9f51c640">Double tap at location and say the label (4)</td>
    </tr>
    <tr>
      <th id="pdf-table-1023:0-67adc52c-935:0-fcd2e655" scope="row" headers="pdf-table-1023:0-67adc52c-918:0-6eb51d0b pdf-table-1023:0-67adc52c-922:0-b5e367e2">Alternative Interactions (Speech I/P)</th>
      <td headers="pdf-table-1023:0-67adc52c-919:0-ac71439a pdf-table-1023:0-67adc52c-922:0-b5e367e2 pdf-table-1023:0-67adc52c-935:0-fcd2e655">10%</td>
      <td headers="pdf-table-1023:0-67adc52c-920:0-49687078 pdf-table-1023:0-67adc52c-922:0-b5e367e2 pdf-table-1023:0-67adc52c-935:0-fcd2e655">0%</td>
      <td headers="pdf-table-1023:0-67adc52c-921:0-7dc3265e pdf-table-1023:0-67adc52c-922:0-b5e367e2 pdf-table-1023:0-67adc52c-935:0-fcd2e655"></td>
    </tr>
    <tr>
      <th id="pdf-table-1023:0-67adc52c-938:0-78de78c4" scope="row" rowspan="4" headers="pdf-table-1023:0-67adc52c-917:0-9180eb63">Edit</th>
      <th id="pdf-table-1023:0-67adc52c-939:0-8092c2e0" scope="row" headers="pdf-table-1023:0-67adc52c-918:0-6eb51d0b pdf-table-1023:0-67adc52c-938:0-78de78c4">Gestures + Voice (Speech I/P)</th>
      <td headers="pdf-table-1023:0-67adc52c-919:0-ac71439a pdf-table-1023:0-67adc52c-938:0-78de78c4 pdf-table-1023:0-67adc52c-939:0-8092c2e0">40%</td>
      <td headers="pdf-table-1023:0-67adc52c-920:0-49687078 pdf-table-1023:0-67adc52c-938:0-78de78c4 pdf-table-1023:0-67adc52c-939:0-8092c2e0">50%</td>
      <td headers="pdf-table-1023:0-67adc52c-921:0-7dc3265e pdf-table-1023:0-67adc52c-938:0-78de78c4 pdf-table-1023:0-67adc52c-939:0-8092c2e0">Hold index finger at location and use voice commands (e.g. Edit Label) followed by the new label (4)</td>
    </tr>
    <tr>
      <th id="pdf-table-1023:0-67adc52c-943:0-3a95cc7d" scope="row" headers="pdf-table-1023:0-67adc52c-918:0-6eb51d0b pdf-table-1023:0-67adc52c-938:0-78de78c4">Gestures (Speech I/P)</th>
      <td headers="pdf-table-1023:0-67adc52c-919:0-ac71439a pdf-table-1023:0-67adc52c-938:0-78de78c4 pdf-table-1023:0-67adc52c-943:0-3a95cc7d">20%</td>
      <td headers="pdf-table-1023:0-67adc52c-920:0-49687078 pdf-table-1023:0-67adc52c-938:0-78de78c4 pdf-table-1023:0-67adc52c-943:0-3a95cc7d">43%</td>
      <td headers="pdf-table-1023:0-67adc52c-921:0-7dc3265e pdf-table-1023:0-67adc52c-938:0-78de78c4 pdf-table-1023:0-67adc52c-943:0-3a95cc7d">Hold index finger at location and say new label (2)</td>
    </tr>
    <tr>
      <th id="pdf-table-1023:0-67adc52c-947:0-5bbf7603" scope="row" headers="pdf-table-1023:0-67adc52c-918:0-6eb51d0b pdf-table-1023:0-67adc52c-938:0-78de78c4">Gestures (Keyboard I/P)</th>
      <td headers="pdf-table-1023:0-67adc52c-919:0-ac71439a pdf-table-1023:0-67adc52c-938:0-78de78c4 pdf-table-1023:0-67adc52c-947:0-5bbf7603">10%</td>
      <td headers="pdf-table-1023:0-67adc52c-920:0-49687078 pdf-table-1023:0-67adc52c-938:0-78de78c4 pdf-table-1023:0-67adc52c-947:0-5bbf7603">0%</td>
      <td headers="pdf-table-1023:0-67adc52c-921:0-7dc3265e pdf-table-1023:0-67adc52c-938:0-78de78c4 pdf-table-1023:0-67adc52c-947:0-5bbf7603">Double tap at location and say new label (2)</td>
    </tr>
    <tr>
      <th id="pdf-table-1023:0-67adc52c-951:0-c4372b95" scope="row" headers="pdf-table-1023:0-67adc52c-918:0-6eb51d0b pdf-table-1023:0-67adc52c-938:0-78de78c4">Alternative Interactions (Speech I/P)</th>
      <td headers="pdf-table-1023:0-67adc52c-919:0-ac71439a pdf-table-1023:0-67adc52c-938:0-78de78c4 pdf-table-1023:0-67adc52c-951:0-c4372b95">10%</td>
      <td headers="pdf-table-1023:0-67adc52c-920:0-49687078 pdf-table-1023:0-67adc52c-938:0-78de78c4 pdf-table-1023:0-67adc52c-951:0-c4372b95">0%</td>
      <td headers="pdf-table-1023:0-67adc52c-921:0-7dc3265e pdf-table-1023:0-67adc52c-938:0-78de78c4 pdf-table-1023:0-67adc52c-951:0-c4372b95">Scrub at location and say new label (2)</td>
    </tr>
    <tr>
      <th id="pdf-table-1023:0-67adc52c-955:0-6ea4e250" scope="row" rowspan="2" headers="pdf-table-1023:0-67adc52c-917:0-9180eb63">Retrieve</th>
      <th id="pdf-table-1023:0-67adc52c-956:0-9b0a8f93" scope="row" headers="pdf-table-1023:0-67adc52c-918:0-6eb51d0b pdf-table-1023:0-67adc52c-955:0-6ea4e250">Gestures + Voice</th>
      <td headers="pdf-table-1023:0-67adc52c-919:0-ac71439a pdf-table-1023:0-67adc52c-955:0-6ea4e250 pdf-table-1023:0-67adc52c-956:0-9b0a8f93">40%</td>
      <td headers="pdf-table-1023:0-67adc52c-920:0-49687078 pdf-table-1023:0-67adc52c-955:0-6ea4e250 pdf-table-1023:0-67adc52c-956:0-9b0a8f93">50%</td>
      <td headers="pdf-table-1023:0-67adc52c-921:0-7dc3265e pdf-table-1023:0-67adc52c-955:0-6ea4e250 pdf-table-1023:0-67adc52c-956:0-9b0a8f93">Hold index finger at location and use voice commands (e.g. Read Label) (5)</td>
    </tr>
    <tr>
      <th id="pdf-table-1023:0-67adc52c-960:0-807a87bc" scope="row" headers="pdf-table-1023:0-67adc52c-918:0-6eb51d0b pdf-table-1023:0-67adc52c-955:0-6ea4e250">Gestures</th>
      <td headers="pdf-table-1023:0-67adc52c-919:0-ac71439a pdf-table-1023:0-67adc52c-955:0-6ea4e250 pdf-table-1023:0-67adc52c-960:0-807a87bc">50%</td>
      <td headers="pdf-table-1023:0-67adc52c-920:0-49687078 pdf-table-1023:0-67adc52c-955:0-6ea4e250 pdf-table-1023:0-67adc52c-960:0-807a87bc">50%</td>
      <td headers="pdf-table-1023:0-67adc52c-921:0-7dc3265e pdf-table-1023:0-67adc52c-955:0-6ea4e250 pdf-table-1023:0-67adc52c-960:0-807a87bc">Double tap at location (4)</td>
    </tr>
    <tr>
      <th id="pdf-table-1023:0-67adc52c-964:0-506cc500" scope="row" rowspan="3" headers="pdf-table-1023:0-67adc52c-917:0-9180eb63">Delete</th>
      <th id="pdf-table-1023:0-67adc52c-965:0-7533ad59" scope="row" headers="pdf-table-1023:0-67adc52c-918:0-6eb51d0b pdf-table-1023:0-67adc52c-964:0-506cc500">Gestures + Voice</th>
      <td headers="pdf-table-1023:0-67adc52c-919:0-ac71439a pdf-table-1023:0-67adc52c-964:0-506cc500 pdf-table-1023:0-67adc52c-965:0-7533ad59">50%</td>
      <td headers="pdf-table-1023:0-67adc52c-920:0-49687078 pdf-table-1023:0-67adc52c-964:0-506cc500 pdf-table-1023:0-67adc52c-965:0-7533ad59">50%</td>
      <td headers="pdf-table-1023:0-67adc52c-921:0-7dc3265e pdf-table-1023:0-67adc52c-964:0-506cc500 pdf-table-1023:0-67adc52c-965:0-7533ad59">Hold index finger at location and use voice commands (e.g. Erase Label) (5)</td>
    </tr>
    <tr>
      <th id="pdf-table-1023:0-67adc52c-969:0-2a434200" scope="row" headers="pdf-table-1023:0-67adc52c-918:0-6eb51d0b pdf-table-1023:0-67adc52c-964:0-506cc500">Gestures</th>
      <td headers="pdf-table-1023:0-67adc52c-919:0-ac71439a pdf-table-1023:0-67adc52c-964:0-506cc500 pdf-table-1023:0-67adc52c-969:0-2a434200">20%</td>
      <td headers="pdf-table-1023:0-67adc52c-920:0-49687078 pdf-table-1023:0-67adc52c-964:0-506cc500 pdf-table-1023:0-67adc52c-969:0-2a434200">28.5%</td>
      <td headers="pdf-table-1023:0-67adc52c-921:0-7dc3265e pdf-table-1023:0-67adc52c-964:0-506cc500 pdf-table-1023:0-67adc52c-969:0-2a434200">Swipe at location (2)</td>
    </tr>
    <tr>
      <th id="pdf-table-1023:0-67adc52c-973:0-de0813d4" scope="row" headers="pdf-table-1023:0-67adc52c-918:0-6eb51d0b pdf-table-1023:0-67adc52c-964:0-506cc500">Alternative Interactions</th>
      <td headers="pdf-table-1023:0-67adc52c-919:0-ac71439a pdf-table-1023:0-67adc52c-964:0-506cc500 pdf-table-1023:0-67adc52c-973:0-de0813d4">10%</td>
      <td headers="pdf-table-1023:0-67adc52c-920:0-49687078 pdf-table-1023:0-67adc52c-964:0-506cc500 pdf-table-1023:0-67adc52c-973:0-de0813d4">0%</td>
      <td headers="pdf-table-1023:0-67adc52c-921:0-7dc3265e pdf-table-1023:0-67adc52c-964:0-506cc500 pdf-table-1023:0-67adc52c-973:0-de0813d4">Tap followed by double tap (2)</td>
    </tr>
  </tbody>
</table>

Table 4. The four referents used for elicitation of user-defined input in Task 2. The overall max-consensus and consensus-distinct ratio are shown for each referent (using a consensus-threshold of 2). The last column shows the most commonly proposed interaction command for the referent, number in parentheses indicates how many different participants proposed the interaction.

## FINDINGS: CREATION OF TACTILE GRAPHICS

In Task 3, participants frequently performed five static hand postures and three finger movements during creation of tactile graphics (Figure 3). Table 5 lists the fingers used for performing them. This knowledge can be useful in designing recognizable interaction commands.

<table>
  <thead>
    <tr>
      <th id="pdf-table-1024:0-faa963c3-981:0-1c3ede7c" scope="col">Hand Postures</th>
      <th id="pdf-table-1024:0-faa963c3-982:0-f1cd2cc3" scope="col">Fingers in Contact</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th id="pdf-table-1024:0-faa963c3-983:0-6f517c43" scope="row" headers="pdf-table-1024:0-faa963c3-981:0-1c3ede7c">Stabilizing</th>
      <td headers="pdf-table-1024:0-faa963c3-982:0-f1cd2cc3 pdf-table-1024:0-faa963c3-983:0-6f517c43">Multiple (3-5)</td>
    </tr>
    <tr>
      <th id="pdf-table-1024:0-faa963c3-985:0-83fbde81" scope="row" headers="pdf-table-1024:0-faa963c3-981:0-1c3ede7c">Anchoring</th>
      <td headers="pdf-table-1024:0-faa963c3-982:0-f1cd2cc3 pdf-table-1024:0-faa963c3-985:0-83fbde81">Index / Middle (1)</td>
    </tr>
    <tr>
      <th id="pdf-table-1024:0-faa963c3-987:0-dc747c66" scope="row" headers="pdf-table-1024:0-faa963c3-981:0-1c3ede7c">Finger Splitting</th>
      <td headers="pdf-table-1024:0-faa963c3-982:0-f1cd2cc3 pdf-table-1024:0-faa963c3-987:0-dc747c66">Index, Middle, Thumb (2-3)</td>
    </tr>
    <tr>
      <th id="pdf-table-1024:0-faa963c3-989:0-bd84c227" scope="row" headers="pdf-table-1024:0-faa963c3-981:0-1c3ede7c">Finger as a Guide</th>
      <td headers="pdf-table-1024:0-faa963c3-982:0-f1cd2cc3 pdf-table-1024:0-faa963c3-989:0-bd84c227">Index (1)</td>
    </tr>
    <tr>
      <th id="pdf-table-1024:0-faa963c3-991:0-d659bfba" scope="row" headers="pdf-table-1024:0-faa963c3-981:0-1c3ede7c">Stylus Balancing</th>
      <td headers="pdf-table-1024:0-faa963c3-982:0-f1cd2cc3 pdf-table-1024:0-faa963c3-991:0-d659bfba">N/A</td>
    </tr>
    <tr>
      <th id="pdf-table-1024:0-faa963c3-993:0-f297b49b" scope="col">Finger Movements</th>
      <th id="pdf-table-1024:0-faa963c3-994:0-fc353644" scope="col">Fingers in Contact</th>
    </tr>
    <tr>
      <th id="pdf-table-1024:0-faa963c3-995:0-744a7d01" scope="row" headers="pdf-table-1024:0-faa963c3-993:0-f297b49b">Contour Following</th>
      <td headers="pdf-table-1024:0-faa963c3-994:0-fc353644 pdf-table-1024:0-faa963c3-995:0-744a7d01">Index, Middle (1-2)</td>
    </tr>
    <tr>
      <th id="pdf-table-1024:0-faa963c3-997:0-be7b66c9" scope="row" headers="pdf-table-1024:0-faa963c3-993:0-f297b49b">Lateral Motion</th>
      <td headers="pdf-table-1024:0-faa963c3-994:0-fc353644 pdf-table-1024:0-faa963c3-997:0-be7b66c9">Index, Middle (1-2)</td>
    </tr>
    <tr>
      <th id="pdf-table-1024:0-faa963c3-999:0-4a1b7834" scope="row" headers="pdf-table-1024:0-faa963c3-993:0-f297b49b">Contour Guiding</th>
      <td headers="pdf-table-1024:0-faa963c3-994:0-fc353644 pdf-table-1024:0-faa963c3-999:0-4a1b7834">Index, Middle (1-2)</td>
    </tr>
  </tbody>
</table>

Table 5. Fingers used for performing the different hand postures and finger movements observed among participants during creation of tactile graphics. Number in parentheses in second column lists range of fingers expected to be in contact with the drawing surface.

### Static Hand Postures During Drawing

Participants positioned their non-drawing hand to assist with drawing. The majority of the time, participants had both hands and multiple fingers in the drawing area. We observed five characteristic hand postures employed by participants:

Stabilizing, Anchoring, Finger Splitting, Finger as a Guide, and Stylus Balancing.

Stabilizing was used to hold down the tactile film to prevent it from slipping. Participants would push down with their palm and fingers to pin down a large area of the film. They would also try to place their hand such that it provided a reference point for drawing. However, it also prevented them from using their non-drawing hand and seeking tactile feedback.

Anchoring was observed when participants started to draw a new shape or when they were completing it. They would feel out the area and typically bring the index or the middle finger of the non-drawing hand to the point where they wanted to start drawing. Then they would then match the stylus with the finger at that point to draw. When close to completion, they would again anchor the finger at the intended end point and bring the stylus to that point.

Finger Splitting is similar to diverging observed in prior work \[39\], used to direct the stylus. One of the fingers (usually the index finger) of the non-drawing hand was held at the starting point. Another finger moved away from the static point of contact at definite intervals to expand the distance between fingers. The stylus followed this movement, resulting in the intended directionality and curvature.

Finger as a Guide was observed when participants laid down the index finger flat on the tactile film and traced the stylus against it. It was used to give curvature and draw lines to size.

<a id="page-9"></a>

Stylus Balancing was used by participants when they wanted to use their drawing hand (dominant hand) for exploration purposes. They would hold the stylus at the last drawn point with the non-drawing hand.

![Five photographs of the non-drawing hand assisting tactile drawing. Stabilizing: palm and several fingers press the film flat. Anchoring: one index or middle finger marks the stylus start or end point. Finger splitting: one finger stays fixed while another separates to guide direction and curvature. Finger as a guide: an index finger lies flat so the stylus can trace against its edge. Stylus balancing: the stylus is held by the side of the dominant hand while that hand explores the drawing.](../figures/pandey-explore-create-annotate-chi2020/figure-003-p009.png)

Figure 3. Hand postures observed during creation of tactile graphics. From left to right: (1) Stabilizing (2) Anchoring (3) Finger Splitting (4) Finger as a Guide (5) Stylus Balancing

### Observed Finger Movements

All participants used contour following [\[25\]. They would trace](<#page-12>) the outlines they created with the index and middle fingers of their non-drawing hand, closely following the stylus. After completing the intended part of the drawing, participants would go back to confirm the shape by following the contour along the entire length of the outline. The confirmatory contour following was often carried out by the drawing hand. Participants would switch the stylus to the other hand or hold it limply as they traced the shape. The non-drawing hand was usually held static on the tactile film. We also observed lateral motion when participants created [large shapes \[25\].](<#page-12>) They would scrub their index and middle fingers on the area encapsulated by the boundaries to assess the shape.

A characteristic movement we observed, not noted in prior work, was that of ‘contour guiding’. Participants would use it to give curvature to a line. They would move the fingers of the non-drawing hand smoothly in a curve and follow it with the stylus. It was often accompanied by pressure from the palms of the non-drawing hand to hold the tactile film in place.

### Preferences for Labeling Tactile Graphics

Four participants used braille to label their drawings. One participant (P9) said he did not have a preference between braille and audio when labeling the graphics. He had used braille because it was available. Other participants chose braille because they felt they could optimize their exploration with braille, and it was easily discoverable: “It’s what I am most used to, what I feel more comfortable with. Plus I feel that you can be looking at the map and reading the labels at the same time. Instead of look and pause, wait to see the label. ‘Oh, okay Pond!’. Because you can be feeling pond curves and with the bottom of your finger feel the letters.” P9 said that although creating and using audio labels with the commands she invented would be quite simple, reading in Braille would be “even simpler” and it “won’t rely on any software” (P10).

Five participants used both audio and braille labels. Besides no additional effort required for audio labeling, participants felt this approach made their graphics universally accessible:

“I would, like I said earlier, like something that could give information to as many users as possible. There is nothing saying that I wouldn’t also include some kind of print label with those pieces as well. So yeah...that way everybody can read it.” (P1). Some of the findings were consistent with Task 2. For instance, participants talked about how they would use braille to represent general information and record specific details using audio. They also elaborated upon how use of audio was going to be inaccessible to people who were deaf-blind, or that audio would not be usable in public settings. To tackle these issues, some participants wanted the audio labels to be accessible with braille displays too.

Only P7 chose to label in audio exclusively. She felt audio was the simplest approach for labeling tactile graphics. Another participant (P3) commented on how audio could be used even by people who weren’t comfortable with braille or couldn’t read braille. For instance, even sighted people could collaborate in graphics creation with audio labeling.

## DESIGN CONSIDERATIONS

Based on the findings and participants’ feedback, we make the following design recommendations for digital drawing tools:

- 1. Provide an overview of audio labels: We recommend providing a summary of all audio labels. Specifically, audio overviews can provide context for subsequent tactile graphics creation and exploration. This approach is similar to providing a braille key. In Task 1, participants were able to use the key to quickly learn about the type of information already on the map. Further, we recommend including spatial information about key elements in the overview (e.g., “the diagram is divided into three main regions...,” or “At the left...” etc.). End-user can manually define the overview labels after creating the tactile graphic or an audio summary can be automatically generated by the system by combining individual labels.

- 2. Use both braille and audio labels when possible: The majority of our participants mentioned a preference for braille labels as they could naturally switch between tactile elements and braille. However, based on our findings (and as also reported by participants), audio labels significantly reduce the time taken to retrieve the information. Therefore, we recommend using braille labels to present high-level information such as abbreviated place names and use audio labels for low-level details such as place descriptions which can be accessed on-demand. Prior work has shown combination of both modalities to be useful for students when [working with algebra \[14\]. In the context of tactile graphics,](<#page-11>) this approach of combined audio and braille labels could also minimize tactile clutter. We also recommend that the detailed information made available through audio should be accessible in braille by integrating braille displays with digital drawing tools. This will make the graphics accessible to people who are deaf-blind and make its usage possible in public spaces.

<a id="page-10"></a>

- 3. Use familiar gestures that do not interfere with diagram exploration: We recommend using consistent gestures based on standard mobile screen readers (e.g., single tap, double-tap, and swipe gestures) to interaction with audio labels. Participants expressed that they prefer gestures that are already familiar to them to lower the cost of learning. Additionally, standard gestures may lower interference with gestures used for drawing exploration. When designing new gestures, we recommend that designers consider the hand postures and finger movements we have reported in [our study along with as well as Table 5 to guide the design](<#page-8>) of interactions. This will minimize conflicts with users’ exploration and the creation of tactile graphics.

- 4. Use voice commands when appropriate: To support a larger number of actions for labeling, we recommend using short voice commands instead of adding new gestures. This approach can minimize ambiguity that may arise from overloading gestures. The words used in voice commands should explicitly state the intent of the desired action. However, participants also pointed out that voice commands may not be usable in public settings such as schools or workplaces as they may disturb others. They may also conflict with ambient noise. Therefore, we recommend using voice commands only when necessary and by considering the context of use.

- 5. Make audio information discoverable: Participants strongly preferred using a differently textured tactile marker to indicate the presence of audio labels. We propose that designers consider standard representations for label markers. A standard material, texture, and size should be used across all drawings so that users can quickly tell audio labels from components of the graphics. For placement of audio labels, we recommend designers should consider the shape, size, and proximity to other tactile symbols when placing audio labels. Digital drawing tools should guide the optimal placement of such labels. This would save the end-users effort in locating the right regions for labeling things.

## DISCUSSION

The overarching goal of this research is to provide design implications for digital drawing tools so that they allow end-users to annotate their graphics. Interestingly, in Task 1 we noted that participants read more braille labels than audio and had multiple strategies for accessing braille labels. We would like to point out that accessing audio labels required performance of a gesture. Most audio-tactile systems use some triggering gesture (such as double taps or speech commands) to provide audio information. Having to perform this gesture in front of the study coordinator may have led to low utilization of audio labels. On the contrary, braille is more discrete approach, as also mentioned by the participants. Thus, it is possible that in a more private setting, audio labels are utilized more frequently.

In Task 1, we also did not discuss participants’ use of spatial cognition and memory. We focused on comparing their use of braille vs audio labels as this has not been addressed in prior work. We took care to choose stimuli that would not require distinct spatial skills in either condition and used a within-subjects design to account for individual differences among participants. Despite these considerations, individual spatial abilities may have played a role in the choice of strategies.

In Task 3, four participants chose to label in braille only. The research team had prepared all the braille labels in advance to focus on participants’ drawing and labeling strategies. Participants only had to peel off the backs of the braille stickers and place the labels at the locations of their choice. It is likely that providing readymade labels affected their decision to use braille. Outside of study setting, the process of creating braille labels is quite disjointed from the process of creating tactile graphics, typically requiring labels to be created in batches either before or after the drawing is completed. This prevent users from labeling as they draw. Thus, it is possible that participants’ preference may change in favor of audio labels outside of study settings.

Digital drawing tools for visually impaired people are increasingly relying only on the audio modality to present information. Our findings show that both braille and audio have modality-specific advantages and disadvantages. Combining them is likely a better approach towards developing interactive tactile graphics. However, our study does not compare the combined approach with graphics labeled solely in audio or braille. This needs further examination and will be our focus in future.

We conducted our study with tactile maps only. We chose maps over other graphics (eg. diagrams, charts, etc) because they are used by visually impaired people of all age groups for navigation, education, mobility training, etc. Like maps, other tactile graphics also tend to include a limited number of braille labels on the graphic and a separate key with details. Given this similarity among graphics, we feel our findings are likely to generalize to other graphics too. However, more nuanced behaviors may emerge with focused studies.

## CONCLUSION

In this paper, we report findings from a three-task study with 11 visually impaired adults on the use of braille and audio labels. Specifically, we offer insights on ways to organize audio information on interactive tactile graphics for better usability. We also report on end-users’ preferences to interact with audio labels and how these may conflict with specific hand postures and finger movements. We derive design considerations for supporting exploration, creation, and annotation of tactile graphics using audio. Our findings provide valuable insights for designing digital drawing tools that enable visually impaired people to draw and share their ideas independently.

## ACKNOWLEDGEMENTS

The Smith-Kettlewell Eye Research Institute, Lighthouse for the Blind of San Francisco, and the National Federation for the Blind helped with recruitment and provided space to run the studies. Vaishnav Kameswaran, Hrishikesh Rao, Matthew Kay, Robin Brewer, and Mustafa Naseem provided valuable input on different aspects of the paper. Lastly, we want to thank all the participants without whom this work would not have been possible.

<a id="page-11"></a>

## REFERENCES

\[1\] 2012. Guidelines and Standards for Tactile Graphics, 2010. (Feb 2012). [http:](<http://www.brailleauthority.org/tg/web-manual/index.html>) [//www.brailleauthority.org/tg/web-manual/index.html](<http://www.brailleauthority.org/tg/web-manual/index.html>)

\[2\] 2013. National Federation of the Blind Resolutions for 2013. (Aug 2013). [https://nfb.org/images/nfb/](<https://nfb.org/images/nfb/publications/bm/bm13/bm1308/bm130813.htm>) [publications/bm/bm13/bm1308/bm130813.htm](<https://nfb.org/images/nfb/publications/bm/bm13/bm1308/bm130813.htm>)

\[3\] 2019. TouchGraphics - Tactile Design for Universal Access. [http://touchgraphics.com/.](<http://touchgraphics.com/>) (2019). Accessed: May, 2019.

\[4\] 2019. ViewPlus - Delivering Sense Ability. [https://viewplus.com/.](<https://viewplus.com/>) (2019). Accessed: May, 2019.

\[5\] Frances K Aldrich and Linda Sheppard. 2001. Tactile graphics in school education: perspectives from pupils. British Journal of Visual Impairment 19, 2 (2001), 69–73.

\[6\] Catherine M Baker, Lauren R Milne, Jeffrey Scofield, Cynthia L Bennett, and Richard E Ladner. 2014. Tactile graphics with a voice: using QR codes to access text in tactile graphics. In Proceedings of the 16th international ACM SIGACCESS conference on Computers &amp; accessibility. ACM, 75–82.

\[7\] Sandra Bardot, Marcos Serrano, Bernard Oriola, and Christophe Jouffrais. 2017. Identifying How Visually Impaired People Explore Raised-line Diagrams to Improve the Design of Touch Interfaces. In Proceedings of the 2017 CHI Conference on Human Factors in Computing Systems (CHI ’17). ACM, New York, NY, USA, 550–555. DOI:

[http://dx.doi.org/10.1145/3025453.3025582](<http://dx.doi.org/10.1145/3025453.3025582>)

\[8\] Jens Bornschein, Denise Bornschein, and Gerhard Weber. 2018a. Blind Pictionary: Drawing Application for Blind Users. In Extended Abstracts of the 2018 CHI Conference on Human Factors in Computing Systems (CHI EA ’18). ACM, New York, NY, USA, Article D117, 4 pages. DOI:

[http://dx.doi.org/10.1145/3170427.3186487](<http://dx.doi.org/10.1145/3170427.3186487>)

\[9\] Jens Bornschein, Denise Bornschein, and Gerhard Weber. 2018b. Comparing Computer-Based Drawing Methods for Blind People with Real-Time Tactile Feedback. In Proceedings of the 2018 CHI Conference on Human Factors in Computing Systems. ACM, 115.

\[10\] Jens Bornschein and Gerhard Weber. 2017. Digital Drawing Tools for Blind Users: A State-of-the-Art and Requirement Analysis. In Proceedings of the 10th International Conference on PErvasive Technologies Related to Assistive Environments (PETRA ’17). ACM, New York, NY, USA, 21–28. DOI:

[http://dx.doi.org/10.1145/3056540.3056542](<http://dx.doi.org/10.1145/3056540.3056542>)

\[11\] Anke Brock and Christophe Jouffrais. 2015. Interactive Audio-tactile Maps for Visually Impaired People. SIGACCESS Access. Comput. 113 (Nov. 2015), 3–12.

[DOI:http://dx.doi.org/10.1145/2850440.2850441](<http://dx.doi.org/10.1145/2850440.2850441>)

\[12\] Anke M. Brock, Philippe Truillet, Bernard Oriola, Delphine Picard, and Christophe Jouffrais. 2015.

Interactivity Improves Usability of Geographic Maps for

Visually Impaired People. Hum.-Comput. Interact. 30, 2

(March 2015), 156–194. DOI:

[http://dx.doi.org/10.1080/07370024.2014.924412](<http://dx.doi.org/10.1080/07370024.2014.924412>)

\[13\] Julien Epps, Serge Lichman, and Mike Wu. 2006. A study of hand shape use in tabletop gesture interaction. In CHI’06 extended abstracts on human factors in computing systems. ACM, 748–753.

\[14\] Silvia Fajardo Flores and Dominique Archambault. 2014. Multimodal interface for working with algebra: Interaction between the sighted and the non sighted. In International Conference on Computers for Handicapped Persons. Springer, 606–613.

\[15\] Giovanni Fusco and Valerie S. Morash. 2015. The Tactile Graphics Helper: Providing Audio Clarification for Tactile Graphics Using Machine Vision. In Proceedings of the 17th International ACM SIGACCESS Conference on Computers &amp; Accessibility (ASSETS ’15). ACM, New York, NY, USA, 97–106. DOI: [http://dx.doi.org/10.1145/2700648.2809868](<http://dx.doi.org/10.1145/2700648.2809868>)

\[16\] William Grussenmeyer and Eelke Folmer. 2016. AudioDraw: user preferences in non-visual diagram drawing for touchscreens. In Proceedings of the 13th Web for All Conference. ACM, 22.

\[17\] Hesham M. Kamel and James A. Landay. 1999. The Integrated Communication 2 Draw (IC2D): A Drawing Program for the Visually Impaired. In CHI ’99 Extended Abstracts on Human Factors in Computing Systems (CHI EA ’99). ACM, New York, NY, USA, 222–223. [DOI:http://dx.doi.org/10.1145/632716.632854](<http://dx.doi.org/10.1145/632716.632854>)

\[18\] Hesham M. Kamel and James A. Landay. 2000. A Study of Blind Drawing Practice: Creating Graphical Information Without the Visual Channel. In Proceedings of the Fourth International ACM Conference on Assistive Technologies (Assets ’00). ACM, New York, NY, USA, 34–41. DOI: [http://dx.doi.org/10.1145/354324.354334](<http://dx.doi.org/10.1145/354324.354334>)

\[19\] Shaun K Kane, Brian Frey, and Jacob O Wobbrock. 2013. Access lens: a gesture-based screen reader for real-world documents. In Proceedings of the SIGCHI Conference on Human Factors in Computing Systems. ACM, 347–350.

\[20\] Shaun K Kane and Jacob O Wobbrock. 2011. Usable Gestures for Blind People: Understanding Preference and Performance. In Proceedings of the SIGCHI Conference on Human Factors in Computing Systems. ACM, 413–422.

\[21\] John M Kennedy. 1980. Blind people recognizing and making haptic pictures. In Dürer’s Devices: Beyond the Projective Model of Pictures. Elsevier, 263–303.

\[22\] John M Kennedy. 1983. What can we learn about pictures from the blind? Blind people unfamiliar with pictures can draw in a universally recognizable outline style. American Scientist 71, 1 (1983), 19–26.

<a id="page-12"></a>

\[23\] Martin Kurze. 1996. TDraw: a computer-based tactile drawing tool for blind people. In International ACM Conference on Assistive Technologies. 131–138.

\[24\] Susan J Lederman and Roberta L Klatzky. 1987. Hand Movements: A Window into Haptic Object Recognition. Cognitive Psychology 19, 3 (1987), 342–368.

\[25\] Susan J Lederman and Roberta L Klatzky. 1993. Extracting object properties through haptic exploration. Acta Psychologica 84, 1 (1993), 29–40.

\[26\] Christophe Mignot, Claude Valot, and Noelle Carbonell. 1993. An experimental study of future “natural” multimodal human-computer interaction. In INTERACT’93 and CHI’93 Conference Companion on Human Factors in Computing Systems. ACM, 67–68.

\[27\] Valerie Morash, Alliosn Collen Pensky, and Joshua Miele. 2012. The Tactile Map Open Stimulus Set for tactile and haptic research. Journal of Visual Impairment and Blindness 106, 8 (2012), 501.

\[28\] Valerie S Morash, Allison E Connell Pensky, Steven TW Tseng, and Joshua A Miele. 2014. Effects of using multiple hands and fingers on haptic performance in individuals who are blind. Perception 43, 6 (2014), 569–588.

\[29\] Meredith Ringel Morris. 2012. Web on the wall: insights from a multimodal interaction elicitation study. In Proceedings of the 2012 ACM international conference on Interactive tabletops and surfaces. ACM, 95–104.

\[30\] João Oliveira, Tiago Guerreiro, Hugo Nicolau, Joaquim Jorge, and Daniel Gonçalves. 2011. BrailleType: unleashing braille over touch screen mobile phones. In IFIP Conference on Human-Computer Interaction. Springer, 100–107.

\[31\] Scott Orlosky and Deborah Gilden. 1992. Simulating a full screen of braille. Journal of microcomputer applications 15, 1 (1992), 47–56.

\[32\] Delphine Picard, Jean-Michel Albaret, and Anaïs Mazella. 2014. Haptic identification of raised-line drawings when categorical information is given: A comparison between visually impaired and sighted children. Psicologica: International Journal of Methodology and Experimental Psychology 35, 2 (2014), 277–290.

\[33\] Delphine Picard and Samuel Lebaz. 2012. Identifying raised-line drawings by touch: A hard but not impossible task. Journal of Visual Impairment &amp; Blindness 106, 7 (2012), 427–431.

\[34\] Sandrine Robbe. 1998. An empirical study of speech and gesture interaction: Toward the definition of ergonomic design guidelines. In CHI 98 Conference Summary on Human Factors in Computing Systems. ACM, 349–350.

\[35\] Sandrine Robbe-Reiter, Noëlle Carbonell, and Pierre Dauchy. 2000. Expression constraints in multimodal human-computer interaction. In Proceedings of the 5th international conference on Intelligent user interfaces. ACM, 225–228.

\[36\] Francisco J Romero-Ramirez, Rafael Muñoz-Salinas, and Rafael Medina-Carnicer. 2018. Speeded up detection of squared fiducial markers. Image and vision Computing 76 (2018), 38–47.

\[37\] Jeff Sauro and James R Lewis. 2010. Average task times in usability tests: what to report?. In Proceedings of the SIGCHI Conference on Human Factors in Computing Systems. ACM, 2347–2350.

\[38\] Linda Sheppard and Frances K Aldrich. 2001. Tactile graphics in school education: perspectives from teachers. British Journal of Visual Impairment 19, 3 (2001), 93–97.

\[39\] Lei Shi, Yuhang Zhao, and Shiri Azenkot. 2017. Designing interactions for 3D printed models with blind people. In Proceedings of the 19th International ACM SIGACCESS Conference on Computers and Accessibility. ACM, 200–209.

\[40\] Annie Vinter, Viviane Fernandes, Oriana Orlandi, and Pascal Morgan. 2012. Exploratory procedures of tactile images in visually impaired and blindfolded sighted children: How they relate to their consequent performance in drawing. Research in Developmental Disabilities 33, 6 (2012), 1819–1831.

\[41\] Jacob O Wobbrock, Meredith Ringel Morris, and Andrew D Wilson. 2009. User-Defined Gestures for Surface Computing. In Proceedings of the SIGCHI Conference on Human Factors in Computing Systems. ACM, 1083–1092.

\[42\] Kim T Zebehazy and Adam P Wilton. 2014. Straight from the source: Perceptions of students with visual impairments about graphic use. Journal of Visual Impairment &amp; Blindness 108, 4 (2014), 275–286.
