<!-- Source PDF SHA-256: e07308078562e9b15ce5c7e8fb6cb5a37e4c911fac2f26fe106e1263b35e2622 -->

<a id="page-1"></a>

# How to Support Designers in Getting Hold of the Immaterial Material of Software

[Source PDF](https://from.so/assets/pdfs/ozenc-how-support-designers-chi2010.pdf) · [Publisher page](https://doi.org/10.1145/1753326.1753707)

Fatih Kursat Ozenc<sup>1</sup>, Miso Kim<sup>1</sup>, John Zimmerman<sup>1</sup><sup>,2</sup>, Stephen Oney<sup>2</sup>, Brad Myers<sup>2</sup> kursat@cmu.edu, misok@andrew.cmu.edu, johnz@cs.cmu.edu, soney@cs.cmu.edu, bam@cs.cmu.edu

<sup>1</sup>School of Design, <sup>2</sup>Human-Computer Interaction Institute,

Carnegie Mellon University, Pittsburgh, PA, USA

CHI 2010, April 10–15, 2010, Atlanta, Georgia, USA. Copyright 2010 ACM 978 -1-60558-929-9/10/04....$10.00.

> Permission to make digital or hard copies of all or part of this work for personal or c lassroom use is granted without fee provided that copies are not made or distributed for profit or commercial advantage and that copies bear this notice and the full citation on the first page. To copy otherwise, or republish, to post on servers or to redi stribute to lists, requires prior specific permission and/or a fee.

## ABSTRACT

When designing novel GUI controls, interaction designers are challenged by the “immaterial” materiality of the digital domain; they lack tools that effectively support a reflecting conversation with the material of software as they attempt to conceive, refine, and communicate their ideas. To investigate this situation, we conducted two participatory design workshops. In the first workshop, focused on conceiving, we observed that designers want to invent controls by exploring gestures, context, and examples. In the second workshop, on refining and communicating, designers proposed tools that could refine movement, document context through usage scenarios, and support the use of examples. In this workshop they struggled to effectively communicate their ideas for developers because their ideas had not been fully explored. In reflecting on this struggle, we began to see an opportunity for the output of a design tool to be a boundary object that would allow for an ongoing conversation between the design and the material of software, in which the developer acts as a mediator for software.

## Keywords

Interactive controls, tools, design process, communication

### ACM Classification Keywords

H.5.2 Information interfaces and presentation – User Interfaces; D.2.6 – Programming Environments; Design

## INTRODUCTION

Through a creative process of ideation (sketching) and iteration (prototyping), designers engage in a “conversation with materials” \[29, 30\], striving to find harmonious intersections between what is possible, acceptable, needed, and desired. As designers conceive of a new idea or refine the details of an existing idea, the materials they use begin to “talk back”, revealing new opportunities and challenges. For example, when sketching with a pencil on paper, designers can explore a product’s physical form, reacting as each line is added to the page. By sketching with scenarios, designers can explore how products might participate in a transaction over time, inventing features and controls as a reaction to the unfolding social situation. In their work to envision “what might be,” designers engage in reflection in action (discovering the idea at the point of rendering it) and reflection on action (stepping back to assess what they have made as they plan their next design move) \[29\]. Through this creative process of conceiving and iterative refinement, designers produce an “ultimate particular” \[34\]; a unique and detailed artifact, intended to have a specific effect.

Interaction designers in particular work with the material of software, focusing on the design of controls that support communication between people and computational systems. Borrowing from work by Djajadiningrat, Norman, Overbeeke, and Wensveen \[9, 24, 25, 38\], we characterize controls as having the following four aspects:

- 1. Affordance: communication of what actions a user is capable of taking.

- 2. Feedforward: communication of what the outcome of an action take might be before the user takes action.

- 3. Expression: ability of the user to express their intention to the system.

- 4. Feedback: communication that the system has recognized the user’s action.

<a id="page-2"></a>

Interaction designers often create new interfaces by rearranging known controls. However, when design problems require the creation of novel controls, designers often struggle to have a conversation with the immaterial material of software. Most designers explore materials in a studio or a workshop, where they cut, bend, and play with a material to develop tacit knowledge of what is possible. However, designers cannot easily play with the material of software, making development of tacit knowledge much more difficult \[7\]. In addition, unlike materials such as steel and plywood, the material nature of software continues to change with the development of new hardware, new software components, and new programming languages and environments. Finally, many interaction designers lack the competency to effectively implement their ideas in software in order to critique them \[28\], significantly limiting reflection on action. Instead, designers often find themselves handing off static, annotated, screen designs \[21, 22\], before they have sufficiently refined the ideas to know this is what they want.

In support of new tools that improve designers’ conversation with the material of software, we conducted two participatory design workshops. The first workshop focused on the conceiving of novel controls, and the second focused on refining the behavior of novel controls and communicating interaction designs to developers. Our findings indicate a need for tools that better support the iterative process of refining roughed out designs, allowing for more reflection in action. Such tools should support the use of motivating examples, capture gestures as explorations of motion, and support a scenario-driven process that keeps a focus on the user’s context.

In addition, in terms of communication between designers and developers, we propose that design tools should frame their output as a boundary object \[33\]. Boundary objects are communicative artifacts that support dialog and consensus building between people coming from different perspectives (areas of expertise) \[33,1\]. Paper blueprints provide a concrete example. Architects use these within a firm to critique ideas; they use these to engage clients in a discussion of what they propose to build, etc. The blueprint as a boundary object helps to create a shared understanding between people involved in the same process, but that have different agendas and expertise. Blueprints have evolved over time into a conventional form that has become embedded in the practice of architecture; however, such detailed, conventional artifacts do not yet exist for software development. Framing the output as a boundary object allows the developer to become the voice of the software, allowing the conversation with material to also include the transfer of the concept from design to development; making the transfer a co-creative endeavor.

In this paper, we first review the literature on the design process for interaction designers and tools intended to support their creativity. Next we detail the goals, structures, rationales, and findings of our two workshops. Finally, we provide a discussion of the key implications for tools intended to support conceiving, refinement, and communication of interactive controls.

## RELATED WORK

Related work falls into two categories: research that details the processes of interaction designers, and the development of tools intended to support the interaction design process.

### On Interaction Designers

As designers sketch, they engage in a conversation with materials in a creative process of conceiving and refining their ideas around “what might be” \[29\]. Researchers in the HCI community have noted that interaction designers engage in this process of sketching, particularly at the beginning of a design process \[7, 22\]. However, designers experience breakdowns, which prevent effective conversation with the material of software for three reasons. First, current tools that support prototyping interactive systems, such as Adobe’s Flash and Director, do not support the iterative investigation and refinement of interactive behaviors \[7\]. Second, designers (non-developers) lack the fluency with development tools to effectively sketch with the material of software. A survey of developers and non-developers who develop web sites reveals that non-developers often cannot effectively implement the features they conceive, even if it only involves arranging standard controls \[28\]. Third, designers have difficulty describing their desired interactive behaviors to developers who will implement these behaviors \[7, 21, 22\], and we suspect this is because they do not know what it is they want, since they have not had enough opportunity for reflection, especially on the small details of the interactive behaviors. In general, designers deliver screen images that are heavily annotated with arrows and text meant to describe the desired behavior \[21, 22\].

Additional research has explored the role of examples. Lab studies have shown how design examples can both inspire and help designers to develop new ideas. Designers pull features and elements from older designs to address issues in their new designs. Herring et al. \[13\] conducted a field study on how designers use and share examples throughout a design process to support the design of new tools. Their work shows many breakdowns around activities such as re-finding examples that are currently in use.

### On Support Tools

Many researchers have developed systems to better support the process of conceiving of and refining interaction designs. The SILK system allows designers to sketch their layouts in a process similar to that of pencil and paper. The system then attempts to recognize familiar controls and give them appropriate behaviors \[17\]. This allows designers to rapidly create many possible layouts using conventional controls and play with the design as part of a critique. DE- NIM, an outgrowth of SILK, allows for conceiving and sketching of web sites at a high level \[23\]. This system enables designers to work with the design of both individual pages and with the overall structure across pages. The DEMAIS system \[2\] allows designers to sketch storyboards as a process of realizing the design of multimedia applications similar to what Shedroff characterizes as sensorial design \[31\]. An evaluation of DEMAIS shows it can support the process of conceiving of and communicating simple behaviors \[3\]. Two recent systems providing fluid sketching are K-Sketch \[27\], which focuses on creating animations, and Sketchflow \[32\], which supports creating prototypes.

<a id="page-3"></a>

Another important topic in the design of support tools has been the construction of multiple concepts and multiple versions of the same concept. Designer’s Outpost allows designers to rapidly switch between different versions of a design \[16\]. Parameter Spectrum shows several previews of effects that designers can apply to modify properties such as color and shape \[35\]. Design Horizons allows designers to see previous versions of a design \[35\]. Finally, Parallel Paths allows designers to apply operations to an element that appears in multiple versions of a design, supporting better side-by-side comparison \[36\].

Our work advances the previous work by focusing specifically on the conceiving and refining of novel controls and on creating more effective boundary objects in the communication phase. In particular, we focus on the processes of and transitions between conceiving, refining, and communicating the design of novel controls. This focus is carried out through our method choice of participatory design, which augments the insights of prior work and merges these insights in the design activity by reflecting in the process and reflecting on the tools.

## PARTICIPATORY DESIGN WORKSHOPS

In order to better understand the process of conceiving, refining, and communicating novel controls, we chose to hold two participatory design workshops. We focused on the conceiving part in the first workshop, and the refining and communicating parts in the second workshop. We looked at patterns or recurring dimensions in the first workshop to inform the framing of the second workshop. We chose a participatory design approach for two reasons. First, the design of novel controls is an activity that does not happen every day within a design project, so using a contextual inquiry approach would be difficult, as it would be hard to recruit design teams engaged in specifically the early phase of design. With participatory design, we could assign a task and see how participants engaged in this work. Second, participatory design allows us to leverage the tacit knowledge of participants as they engage in the assigned tasks \[4, 11\]. This helps to reveal subtle details of the participants’ concerns and barriers in the performance of the tasks. It also helps to keep the focus on the quality and craftsmanship of the work, and not simply the speed with which the work is completed.

### Workshop 1 \| Structure

The focus of the first workshop was on conceiving novel controls. Participants included six professional interaction designers (3 male, 3 female) from several local design firms. All had degrees in design and least two years of professional experience creating screen-based interfaces such as desktop software applications or web sites.

The workshop had the following structure:

- 1. Introduction and warm-up (20 min)

- 2. Reflection in action: Design of novel controls (30 min)

- 3. Sharing of selected concepts (10 minutes per team)

- 4. Design of tools to support conceiving (30 min)

- 5. Reflection on action: Discussion (20 min)

In the warm-up session, participants introduced themselves, provided some details about their current work and their background. They then each shared a short anecdote about designing what they considered to be a novel control.

After the warm-up, we divided the participants into three groups, each with two designers who had never worked together. We assigned each group a project brief and asked them to generate five or more concepts within 30 minutes. This requirement kept their focus on conceiving of new ideas and prevented them from transitioning to refining a single idea.

In order to motivate the design of novel, graphical controls, we carefully constructed three project briefs. In assigning the projects, we wanted to keep the requirements sufficiently simple to leave more space for creativity. Each asked, at an abstract level, for the integration of two sliders in order to control a common device. Radio required participants to design the station selection and volume controls for a radio into a bedspread. While not traditionally graphical, the bedspread does lend itself to a 2-dimensional form of interaction. Shower required participants to address water flow and temperature for a set of controls projected onto the surface of a shower. Stove required participants to address selection of burner and temperature for an interface projected onto a stovetop. While these choices might indicate a focus on creative exploration of tangible interfaces \[12,14,15\], our intention was actually to get designers to rapidly and creatively explore the possibilities of 2- dimensional controls that could work on a computer screen.

After the first work session, we asked each team to present their concepts to members of the other teams. In addition, we asked them to reflect on techniques they considered effective and on the most difficult challenges they faced.

Following the presentations, we asked our participants to design a tool that could support the conceiving process in the previous session. Our participants began this process, still working in teams of two, but then they shifted their strategy, engaging everyone in a discussion on the features such a tool would need. In facilitating the discussion, we made sure to include the acts of conceiving ideas, capturing these ideas, and communicating these ideas within a team and to stakeholders outside of the team.

We concluded the workshop with a reflection-on-action session where participants shared their reflections on the workshop and connected their experiences in these assigned activities with experiences from their daily practice of interaction design.

### Workshop 1 \| Findings

Following the workshop, we reviewed our notes and watched the videos, looking for points of intersection across the three teams. We identified four main insights:

- 1. Designers conceived of new ideas through explorations of the context, grounded in a specific scenario.

- 2. Designers used body gestures to conceive of and communicate ideas.

- 3. Designers were inspired by examples they recall to motivate new designs.

- 4. Designers started with more conventional designs, moved to wildly novel designs, and then moved back to a middle point, in between novelty and convention.

<a id="page-4"></a>

#### Conceiving and communicating with context

We observed that designers constantly experimented with context, including the environment where the larger activity that the controls support takes place, the novel placement of the controls within this environment, and different social situations surrounding the use of the controls. With each new framing of the context, the designers conceived of a new set of controls. In this process of continued reframing, the designers subjectively enacted the role of the user, creating a story of use while they created the control. While different contexts would motivate the needs of different users, in general, the designers seemed to start with the context to define the user instead of starting with a potential user and then defining a context.

For example, the Radio team experimented with different situations where someone might find himself or herself in bed. After exploring a person in bed alone, the team moved to explorations of two people in bed, drawing out details of why those people might be together (Figure 1). By subjectively placing themselves as a couple in bed together, they conceived of a footboard control where one person expresses a desired volume and the other person expresses a desired channel. The situation of an intimately close couple in bed opened up the opportunity to envision a set of controls that require collaboration. Starting from the context of two people in bed led to an idea that was very different from the ideas generated around a single person in bed.

![Figure 1. Drawings of Team Radio: Notice this exploratory sketch shows the context of use and not simply the systems interface. Note that most tools force designers to focus exclusively on the GUI](https://from.so/assets/markdown/figures/ozenc-how-support-designers-chi2010/figure-001-p004.png)

Figure 1. Drawings of Team Radio: Notice this exploratory sketch shows the context of use and not simply the systems interface. Note that most tools force designers to focus exclusively on the GUI

#### Conceiving and communicating with gestures

Participants used gestures in three distinctly different ways as they worked to conceive new controls. First, they would embody the user and invent a control through physical exploration of their body. Second, they would gesture with their hands to communicate the motion they desired to see the system perform. Third, they would gesture with props on top of a sketch, conceiving of and demonstrating the interplay between the various elements.

The Radio team provides a good example of gesture through embodiment. In the process of designing the controls, they lay down on the floor, simulating the experience of lying in bed. From this position they sketched different interactions with their body, in one instance conceiving of a control that operates by continuously flipping the bedspread, and in another creating an expression that involved using both hands to wrap a pillow around the ears to communicate a desire for volume change. In all cases, these actions focused on how users might express their intentions to the system. Their actions align with the ideas of “experience prototyping” \[6\] and “bodystorming” \[26\].

The Stove team provides a nice example of using hand gestures to explore how a system might use motion for feedforward or feedback. When describing how the projection system could move the stove controls around the system in order to keep them close to the user, a team member traced the motion of the controls through the air, creating and communicating the motion it would take as it reacted to the user’s change of position within the space.

The Stove team also provided a good example of how designers use gestures with props. After drawing a wireframe of a projected control on paper, one of the team members gestured with the pen directly above the drawing, moving it back and forth to create and communicate where menus would appear and how users could click on buttons, changing the state of the stove. In fact, all of the participants exhibited this behavior, often using props or a pen in their hand as they moved through a sequence of actions over time. This type of gesture generally captured expression and feedback, while feedforward and affordance came from the static wireframe.

It is important to note that for the majority of these gestural activities, there was no record of the gesture after the conceiving or communication of the design idea. The designers had no way to capture this information.

#### Examples

Our findings confirm previous work claiming designers want and use examples as inspiration and communication \[5, 13\]. Across the different teams we observed the use of examples of physical materials; examples of moving objects in the real world; and examples of feedback, feedforward, or expressions they had seen or previously experienced in another product form.

Participants used their recollection of physical materials as a source of inspiration. For example, the Stove team talked about the rubber membrane seen on top of buttons used by ground crews to move a “jet way” to the door of a commercial airplane. While wrestling with the idea that the stove controls would need to be cleaned, the team members detailed how this rubber-like material behaves as a button but feels like smooth glass. They talked about the aesthetic quality of the text underneath this material, as the membrane would break down over time in considering this example’s influence on their design.

<a id="page-5"></a>

Several teams drew from their experience of motion in the real world to guide the design work. The Radio team used examples of how people move their bodies to inspire designs. The Shower team discussed both the motion of skiers and the motion of people playing Dance-Dance-Revolution as they conceived of and communicated novel expressions of intent for the shower controls. They proposed one of their more extreme examples – having users operate the shower by moving their foot across a slider that runs the length of the shower – by matching the motion of a cross-country skier.

Participants used anecdotes taken from state-of-the-art products, allowing the designer to quickly characterize a certain kind of interactive behavior. For example, the Shower team discussed the novel way a new Blackberry phone’s menu behaves, using this as a starting point for exploring interaction with the system.

#### Convention and novelty

Across the groups, we observed a pattern of teams starting their explorations by considering very conventional controls. After exploring a few of these, they would break and jump to extremely novel forms. As they perceived time to be running out, they moved back towards convention, designing novel controls with some conventional properties. For example, the Shower team started with wire frames that showed conventional web-like buttons for controlling the shower. They then jumped to more extreme examples like the skiing based, full-floor slider. Then they returned to the middle with a design that had users interact with a thermometer-like slider, where they made an upward motion across the control to increase the water flow and for feedback used a wide bar extending to meet the slider thumb.

The underlying motive in this diverging and converging process appeared to be a desire to create a spectrum of multiple iterations that map what is possible, acceptable, needed, and desired, which has been previously characterized by Loewy as MAYA: Most Advanced, Yet Acceptable \[19\]. In making new things, the designer has to resolve which conventions to keep and which to challenge, and this seems to drive part of the conversation with materials.

### Workshop 2 \| Structure

The second workshop focused on the activities of refining a novel control and communicating the refined idea to developers. This workshop also took a traditional participatory design approach; we asked participants to design the tools they would use to do the work instead of having them engage in the actual activity of refining a design and communicating a design.

Participants included four developers (2 female and 2 male) and four interaction designers (all male) from the local area who all had at least two years of professional experience. None of the participants had taken part in the previous workshop.

The workshop had the following structure: 1. Introduction (10 minutes)

- 2. Reflection in action: Design a tool for refining a novel control (50 minutes)

- 3. Design the best form for communicating a designer’s refined design that needs to be implemented by a developer (50 minutes)

- 4. Reflection on action: Presentation of tools for refinement and communication (5 minutes per team)

We introduced the workshop by first highlighting known issues around refinement and communication. We then provided an overview of our plan and assigned participants to teams.

In the design of a tool for refinement, we divided the participants into four teams made up of one developer and one designer. They were asked to pretend they had conceived of a novel interface and that they needed to refine the interactions around a small set of controls. Then, based on their subjective experience of being in this phase of a design project, we asked them to design a tool that would best allow them to do the work of refining the interaction.

With the intersection of the findings of the first workshop and the goal of focusing on the refinement in the second workshop, we had carefully selected two design topics: an airplane reservation system and a used car purchasing system. We also carefully prepared support materials to communicate designs with controls that needed to be refined. We had several requirements for these materials. First, the materials needed to be specific enough that the participants could understand them while at the same time being open enough that they felt they could refine them without stepping back to conceive of new controls. Second, the materials needed to be digestible very quickly, as we wanted participants to spend the majority of the time designing the tool and not trying to comprehend the design and motivation within the materials. Third, we needed controls that could not work with a simple restructuring of known controls to keep our focus on the design of novel controls. Fourth, we wanted to include materials that matched with the activities we had observed in the first workshop.

The materials included:

- 1. Interface: Static, digital wireframes of interfaces with novel controls (Figures 2 and 3)

- 2. Persona: A persona with image, back-story, and goals.

- 3. Storyboard: A storyboard illustrating the persona engaging the system that captures the persona’s motivation (trigger for using the system); their context at the time of interaction; and their emotional state as an outcome of the interaction. This connects to behaviors in the first workshop, where conceiving grew out of context and scenario construction.

- 4. Moodboard: A moodboard, which provides communication and inspiration for design projects by using sensorial and visual materials \[20\], was provided to capture the desired brand experience for client/service provider.

- 5. Gesture Example: A video of hand gestures that describe the motion desired on the static wireframe. This comes from the observation that in the first workshop, designers

<a id="page-6"></a>

conceived and communicated how things should move by moving their hands.

- 6. Material Example: A photo of a material connected to the wireframe. This example was motivated by the observation from the first workshop that materials could motivate design concepts.

- 7. Motion Example: A video of objects in motion. This connects to the observation in the first workshop that movement of objects can motivate the conceiving of a design.

- 8. Interaction Example: A video of a product with an interaction similar to the interaction desired.

Figure 2 shows the wireframe for the used car-purchasing interface. The novel controls include a timeline at the bottom of the screen that shows repair history and a control to allow users to change the view of the car in order to better observe any damage or wear from use. The gesture example showed hand gestures indicating the motion of getting bigger and bigger, connecting to the concept of zooming in to get a more detailed view of the car. The motion example also included billiard balls knocking together as an illustration of how the timeline should construct itself on the screen. The material example included images of marbles in a row and a toy-plane made of shiny metal. Finally, the interaction example included a performer juggling with crystal balls.

![Figure 2: wireframe used-car shopping interface. A large car preview sits above a horizontal timeline of earlier and later models; sliding along the timeline changes the car year. Controls beside the car select additional attributes. The design was used as a novel control for the refinement workshop.](https://from.so/assets/markdown/figures/ozenc-how-support-designers-chi2010/figure-002-p006.png)

Figure 2. Interface for an online used car purchasing system

Figure 3 shows the wireframe for an airplane reservation system. Moving from left to right, the novel controls involve: a set of sliders for expressing the user’s desires for different features; a list of plane shapes that works as a visualization of items that match the criteria where the topmost planes are the closest match, and that uses relative spacing to better communicate the closeness of the match; a list of flight details; and a “dressing room” area where the user can keep a set of flights they consider interesting.

For the airplane reservation system, the gesture example included sorting for search. The motion example included a video of circus performers sliding face down on poles as an indication of the motion of the planes when providing feedback to changes in the sliders. The material example showed birds sitting on a power line as a material example of the layout of the planes. Finally, the interaction example included a performer throwing cards for selection.

The refinement task focused on designing a tool for refining these designs. Two teams worked with materials from the airplane reservation systems and two teams worked on the materials from the used-car purchasing system.

For the communication task, we needed to create a situation where the designers understood the design and needed to communicate it to the developer. Thus, we switched the teams around. Developers who had worked on the used-car system now partnered with designers who had worked on the airplane reservations, and vice versa.

Next, we asked them to perform two main activities. First, we asked the designers to explain the design from the previous session to their new partner. We told the developers to assume that they needed to start programming from this explanation. Then, we asked both designer and developer to design a communicative artifact that designers could deliver to developers that would best capture the needs of the developers to make the artifact and the needs of the designers to effectively capture their vision. In the end, we asked all of the groups to share their designs.

![Figure 3: wireframe flight-reservation interface. Selection controls occupy the left, plane-shaped result markers show how well flights match the criteria, and a dressing-room area on the right holds flights the user wants to keep for comparison.](https://from.so/assets/markdown/figures/ozenc-how-support-designers-chi2010/figure-003-p006.png)

Figure 3. Interface for an online flight reservation system

### Workshop 2 I Findings

Following the second workshop, we again reviewed our notes and watched the videos we had taken, looking for points of intersection across the four teams. We identified three main insights from the refinement task:

- 1. There is a need for a tool that can rough out motion using capturing technologies, and that can allow users to refine the properties of the rough motion.

- 2. Examples are used as inspirations and for deriving properties, applied to the interactive behaviors.

- 3. There is a need to support multiple versions to support iterative cycles and creativity.

For the communication, we identified three main insights:

- 1. Participants found static, annotated screens to be inadequate in support of communication and transfer of the design concept.

- 2. Designers and developers had quite differing views of what context means. Designers focused on the user’s

<a id="page-7"></a>

context of use while developers seemed more interested in the context of the screen and the relationship between the different interactive elements.

- 3. Movies that capture the underlying user scenarios and that also document the dynamic changes in the interface were seen as the most effective technique for communicating a refined design.

#### Refinement

All of the groups expressed a desire for tools that would allow them to use gestures to create rough motion sketches. For example, one of the teams wanted to capture the motion of wiggling, by gesturing the movement using the mouse. An ability to sketch motion with gesture also connects to an exploration of other major properties such as size and rotation. In the design of their tools, participants expressed the need to make and reflect on many motion sketches. They wanted the ability to keep making rough moves till discovering the one that seemed to fit best, working to express an idea they had in their head as well as reacting to this idea as the tool gave it an initial form. Once they had a rough approximation of the movement, they would want to begin to refine the smaller details using other tools.

All of the teams were inspired by the examples we provided as part of the materials for communicating the design they were to refine. In general, they relied on these heavily for motivating the refinement of the designs. In considering the refinement, several teams began to derive properties from the examples. They derived characteristics from given examples such as size, speed, timing, nuance, 3D behavior in 2D space, gravity, smoothness, and rotation. They wanted to be able to create new properties within the refinement tool that are mapped to aspects of the examples, to manipulate the more subtle aspects of the refined design. Interestingly, these properties were related to the specific context of the example and not to some more general set of properties for describing behavior.

In addition to properties from the examples, the design teams wanted to create their own properties that could apply to the elements they had added and to the motions they had roughed in with the gesture tool. Like the properties from the examples, these were not meant to be universal properties, but properties related to needs specific to an element. For example, in trying to define the behavior of motion, one team wanted to create a property that would allow them to specify the flow of an object similar to how a physical object might slide differently on a carpeted surface or on a polished stone surface. This range from carpet to polished stone was specific to the movement of this one element on the screen. One team suggested manipulating these properties on top of the rough movements using a layered stage idea similar to how music software works. They could keep applying different properties that would interact with each other in the same way different sounds begin to blend together.

Participants also expressed a need for the refinement tool to support working with many iterations of the same design, allowing designers to broadly explore the small details in the behaviors. One team, which approached properties through the application of layers, talked about how this would allow designers to more easily make and reflect on many iterations. The designer could add or remove various layers or adjust the details of a specific layer to rapidly try new ideas. One team imagined tools having the ability to add, copy, delete, show, hide, and save multiple behaviors by simply closing the layers. They also designed a timeline feature for each interactive object. By simply applying multiple layers, they could trigger events or the relationships between different interactive objects on the interface.

#### Communication

In the communication task, all of the designers struggled to describe the refined design to the developers using the static wireframes and adding annotations of hand written text and arrows. In one team, the designer repeatedly walked the developer through the design only to receive puzzled looks. At one point the developer noted that the wireframe and annotations did a poor job of conveying a design she felt was still largely in the designer’s head.

One approach designers used to make the wireframes more effective was to gesture on top of the wireframe, indicating with motion and their voice how different elements reacted while running through a simple scenario of use. The gestures seemed much more effective at communicating the motion and the changes over time than the annotations.

The designers focused on the need to provide very exact details of what the system was supposed to do. They particularly focused a great deal of effort on expressing the nuanced qualities of motion. They claimed that the motion was difficult to explain while the user’s actions and the system’s feedback were much easier. Some teams even suggested a tool that would allow designers to make direct references to the examples they used to motivate the work as a way of more effectively communicating their design.

In contrast to designers’ concern for the expressive quality of motion, the developers seemed less focused on understanding the subtle details and more concerned with general issues of implementation, crystallized by questions such as “Can this be built?” or “Will it be cost effective?” To address this discrepancy, one team suggested that a new tool would allow the development team to define boundaries on the supported interactive behaviors and their interrelations before designers began to conceive of ideas. This would help guide the designer in producing something with the aesthetic quality they desired, but that could also be built.

<a id="page-8"></a>

All teams agreed that communication would be much improved if designers had tools that allowed them to make example movies detailing the interaction. One team suggested using animation, whereas the others stated the need to capture physical movement as a way to communicate the nuances of the movements that designers intended. One team suggested the ability to record annotations and gestures that would appear on top of the screen over time as a scenario of use unfolded. This would allow the many different scenarios of use to be attached to a few core screens.

While all teams agreed on the need for movies and scenarios of use that supported the movies, there was less agreement on the focus of context for these movies. The designers all seemed to work from the perspective of the user, focusing on the movement through a specific task and on the relationships between expression, feedforward and feedback for a single interaction. The developers, on the other hand, had a much greater interest in the relationship between many different onscreen elements. After recognizing this mismatch, one of the teams suggested a tool that could automatically generate the relationships of elements by examining their behavior across the many scenarios.

Finally, all groups suggested a feature for translating motion into numerical data of variables (axis, X curve, time, etc.) that could be translated into code by developers. From their perspective, this not only helped designers to overcome the programming barrier, but also helped both designers and developers improve communication. For developers, it would be helpful if designers could express – in a language developers are familiar with – variables they anticipate would be manipulated.

## DISCUSSION AND DESIGN IMPLICATIONS

In reflecting on the findings from the workshops, we identified four sets of design implications around a new type of tool that would better support interaction designers. These cover nature of the immaterial materiality, scope of the tool’s use during the design process, the specific details for supporting the refinement phase, and a new framing of communication between designers and developers.

### Nature of the Immaterial Materiality

While exploring the form of interactions for the controls, participants used material dimensions of physicality, motion, and interaction examples. They deployed verbal and visual expressions, gestures and scenarios as ways to experiment with these material dimensions. Participants perceived these materials as inspirational, functional, or communicative resources. The interplay between the form and material of interactions for the controls happened through context, both as a repository of materials, and as exploration of form. A future tool would ideally grasp the immaterial materiality of software at least in these three dimensions and through a better understanding of context, both as material resource and form exploration.

### Scope of tool

In general, it appeared that designers worked quite successfully to conceive of novel controls. We witnessed them repeatedly working by taking the perspective of the user in the context of use and then conceiving what the interaction might be \[37\]. Additionally, we witnessed that they derived inspiration from gestures and examples with which they had experience in the world. Based on their ease of working and success at generating ideas, we are not at all confident that they should use electronic tools at this point in the process; tools that tend to focus their attention on a screen and away from the felt-life experience of being the user in context. Instead, we feel designers should engage with a digital tool once they have selected a design direction and want to generate a more detailed concept that they can then refine and transfer to developers. Having decided on the design direction, however, there needs to be a tool that is flexible enough to help the designer to translate the material that has been explored during the conceiving phase. To provide such flexibility, tools need to bridge from ideation to both the conceiving and refinement phases.

### Support for refinement

In supporting the refinement process, a new tool should have the ability to store the many different examples that motivate a design or that connect to a specific control used within a design. In the workshop, we saw designers draw from examples of motion, interaction, and materials. In addition, we watched the teams in the second workshop draw from these examples in order to gain enough understanding of a design direction that they could begin to refine the idea. Ideally the tool would allow designers to toggle between at least two views: one focused on the design of a specific screen or control; and one that allows them to review, add, and comment the various resources that have been collected in support of this design direction.

Based on our observation that designers’ draw inspiration from the user context, channeling the user to continually engage in a scenario-based design approach \[8\], we suggest that this tool also be organized around specific scenarios of use. We suspect that designers will know that they are ready to move from the rough conception of materials to this refining tool when they have produced a set of representative scenarios and have the basic steps that the user needs to take for each. The designer could set the tool up with the set of scenarios they want to detail, and then they could load universal resources such as personas, and scenario-specific resources such as storyboards of users interacting with the product in the context of use.

A successful tool would also allow designers to freely express the motion and then provide some properties for refining the motion. This would allow them to move quickly from many rough sketches to the refinement of a single idea. The issue of properties is less certain. Clearly designers wanted properties specific to a given example while developers expressed the need for a universal set of properties. Work similar to that of Lim \[18\] might provide a middle point for properties. However, more investigation is needed to find harmony between these perspectives.

<a id="page-9"></a>

Finally, the tool should support the ability to make, store, and easily access several versions of both the complete design and of each individual control. Ideally, if a control is used across multiple scenarios, then this control could be accessed from within each of the scenario interfaces that require it. The tool might even have a main repository, so that if a design team member updates the behavior of a control for one scenario/interface, they could easily see the ramifications of this change across all of the interfaces.

### Communication

Throughout the conceiving and refining phases, designers engage in a process of making, of reflecting in and on action, as they resolve both the whole product and the small details of the product. In general, most of this type of making is focused on getting the idea out of a person and then critique that idea within the design team. However, as a design advances, the type of making begins to change, with a focus on making in order to communicate the idea to others. Designers working on novel controls generally have two main stakeholders they must communicate with: (i) developers who will implement these designs and (ii) clients and/or product managers, with whom they must reach a common agreement on what is desired.

During our second workshop, we watched designers struggle to communicate their ideas using static, annotated screens. In general, these worked better when designers could gesture their ideas on top of the screens, but all participants asked for more. They wanted movies that capture the user moving through a scenario and that capture the changes taking place on the screen. In a sense, the output they desire is similar to the output designers can achieve using tools like Adobe’s Flash or Catalyst. However, in reflecting on the interactions and process we observed, we see a new opportunity. We feel the process of transferring a design from designers to developers would be significantly improved by recasting the output of the design process from a specification of what specifically should be built, to a boundary object that allows designers and developers to engage in an effective conversation as to what is desirable, probable, and possible.

In reflecting on our second workshop and on boundary objects, we propose three aspects we feel would be needed to make the tool’s output work effectively as a boundary object between developers and designers. First, it should include animations and interactive simulations demonstrating the main usage scenarios that detail how the user interacts with the system and how the system reacts to the user’s actions. These scenarios should capture the user’s context as well as their triggers, motivations, desires, and expectations that surround their use of the system. Second, it should provide links to the supporting examples, such as videos showing motion, videos showing the interaction design of other products, as well as images used to support the final visual design. Third, it should allow for easy export of visual elements and code to aid with transfer. The boundary object should function socially with both developers and designers, and it should work in isolation. In both cases, users should be able to annotate it with questions, concerns about conflicts and dependencies, and design suggestions, supporting an ongoing conversation and a creative exchange of ideas, allowing for reflection in and on action from both developers and designers.

## CONCLUSION

Software systems expect designers to know what they want to make before beginning the process of making with universal properties limiting the scope of exploration. This structure blocks the ability to have a conversation with the material, where designers rough out ideas (reflecting in action) and then critique what they have done (reflecting on action) in order to conceive of and refine a new idea. Today most interaction designers transfer their design concepts to developers using, static, annotated screens. These transfers are often less than ideal, as the designer has not had enough feedback to know if this is the design they want, but the developer sees this hand-off as something more akin to a specification that should be implemented as described.

In order to better understand the dimensions of a new kind of tool that could support designers in having more effective conversations with software, we conducted two participatory design workshops, looking at conception, refinement, and communication of novel controls. Our findings indicate the need for a tool that can support refinement and communication. Such a tool needs to be able to record the outputs of the conceiving phase, including scenarios and examples of physicality, motion and interaction. In addition, it needs to support gesture as a way for designers to roughly communicate the motions they desire.

The output of the system should be a dynamic boundary object that contains scenario driven movies of the refined interactions that the design team desires as a starting place for a conversation with developers on what can be made given the issues of time, budget, and platform.

## ACKNOWLEDGMENTS

We thank the designers and developers who participated in the workshops. This research was supported by the NSF under grant IIS-0757511. Any opinions, findings and conclusions or recommendations expressed in this material are those of the authors and do not necessarily reflect those of the National Science Foundation.

## REFERENCES

- 1. Arias, E. and Fischer G. Boundary Objects: Their Role in Articulating the Task at Hand and Making Information Relevant to It. In Proc. of ICSC, Academic Press (2000) , 567-574.

- 2. Bailey, B. et al. Supporting Multimedia Designers: Towards more Effective Design Tools. In Proc. of MMM, ACM Press (2001), 267-286.

- 3. Bailey, B. and Konstan, J. Are informal tools better: comparing DEMAIS, pencil and paper, and authorware for early multimedia design. In Proc. of CHI. ACM Press (2003), 313-320.

- 4. Bødker, S., and Iversen, O. Staging a professional participatory design practice. In Proc. of NordiCHI, ACM Press (2002), 11-18.

- 5. Bonnardel, N. Towards Understanding and Supporting Creativity in Design: Analogies in Constrained Cogni-

<a id="page-10"></a>

tive Environment. Knowledge-Based Systems, 13, 7-8

(2000), 505-513.

- 6. Buchenau, M. and Suri, J. Experience prototyping. In Proc. DIS, ACM Press (2000), 424-433.

- 7. Buxton, B. Sketching User Experience: Getting the Design Right and Getting the Right Design. Morgan Kaufman, San Francisco, CA, USA. 2007.

- 8. Carroll, J.M. Making Use: Scenarios and Scenario-based Design. MIT Press, Cambridge, MA, USA, 2000.

- 9. Djajadiningrat, T. et al. But How, Donald, Tell Us How?: On the Creation of Meaning in Interaction Design through Feedforward and Inherent Feedback. In Proc. DIS, ACM Press (2000), 285-291.

- 10.Enactive Network.

http://www.enactivenetwork.org/index.php?8/objectives

- 11.Floyd, C. et al. Out of Scandinavia: Alternative Approaches to Software Design and System Development. Human Computer Interaction. 4, 4 (1989), 253-349.

- 12.Frens, J. W., et al. Form, Interaction and Function, An Exploratorium for Interactive Products. In Proc. of Asian Design Conference (2003)..

- 13.Herring, S. et al. Getting Inspired!: Understanding How and Why Examples are Used in Creative Design Practice. In Proc. of CHI. ACM Press (2009), 87-96.

- 14.Hummels C. Gestural Design Tools: Prototypes, Experiments and Scenarios. PhD dissertation, Delft University of Technology, Delft, The Netherlands, 2000.

- 15.Hummels, C. et al. Move to Get Moved: a Search for Methods, Tools and Knowledge to Design for Expressive and Rich Movement-based Interaction. Personal Ubiquitous Computing, 11, 8 (2007), 677-690.

- 16.Klemmer, S. et al. Where Do Web Sites Come from? Capturing and Interacting with Design History. In Proc. of CHI, ACM Press (2002), 1-8.

- 17. Landay, J. and Myers, B. Sketching Interfaces: Toward More Human Interface Design, IEEE Computer. 34, 3 (2001), 56-64.

- 18. Lim, Y. et al. Interaction Gestalt and the Design of Aesthetic Interactions. In Proc. of DPPI, ACM Press (2007), 239-254.

- 19. Loewy, R. Never Leave Well Enough Alone. Simon and Schuster, New York, NY. USA. 1951.

- 20. McDonagh, D. and Denton, H. Exploring the Degree to Which Individual Students Share a Common Perception of Specific Mood Boards: Observations Relating to Teaching, Learning and Team-based Design. Design Studies, 26, 1 (2005), 35-53.

- 21.Myers, B. et al. How Designers Design and Program Interactive Behaviors. In Symposium on VLHCC, IEEE Press (2008), 177-184.

- 22. Newman, M. and Landay, J. Sitemaps, Storyboards, and Specifications: A Sketch of Web Site Design Practice. In Proc. of DIS, ACM Press (2000), 263-274.

- 23. Newman, M. et al. DENIM: An Informal Web Site Design Tool Inspired by Observations of Practice. Human Computer Interaction. 18, 3 (2003), 259-324.

- 24. Norman, D. The Psychology of Everyday Things. Basic Books, New York, NY, USA. 1988.

- 25. Norman D. Affordance, Conventions, and Design. Interactions, 6, 3 (1999), 38-43.

- 26.Oulasvirta, A., et al. Understanding Contexts by Being There: Case Studies in Bodystorming. Personal Ubiquitous Computing. 7, 2 (2003), 125-134.

- 27. Richard C. et al. K-Sketch: A “Kinetic” Sketch Pad for Novice Animators. In Proc. of CHI, ACM Press (2008), 413-422.

- 28. Rosson, M.B. et al. Who, What, and How: A Survey of Informal and Professional Web Developers. In Symposium on VLHCC, IEEE Press (2005), 199-206.

- 29. Schön, D. The Reflective Practitioner. Temple Smith, London. UK. 1983.

- 30. Schön, D. and Bennett, J. Reflective Conversation with Materials. In Bringing Design to Software. ACM Press. New York, NY, USA. 1996. 171-189.

- 31.Shedroff, N. Information Interaction Design: A Unified Field Theory of Design, Information Design, Ed. Jacob-son, R. MIT Press, MA, USA. 1999. 267-293.

- 32.Sketchflow, Microsoft Expression Blend. Available at http://www.microsoft.com/expression/products/Sketchfl ow\_Overview.aspx

- 33.Star, S. Categories and Cognition: Material and Conceptual Aspects of Large Scale Category Systems, Interdisciplinary Collaboration: An Emerging Cognitive Science. Ed. Derry, S. et al. Lawrence Erlbaum Associates, Mahwah, NJ, USA. 2005. 167-186.

- 34.Stolterman, S. The Nature of Design Practice and Implications for Interaction Design Research. International Journal of Design, 2, 1 (2008), 55-65

- 35.Terry, M. and Mynatt, E. Recognizing Creative Needs in User Interface Design. In Proc. of C&amp;C, ACM Press (2002), 38-44.

- 36. Terry, M. et al. Variation in Element and Action: Supporting Simultaneous Development of Alternative Solutions. In Proc. of CHI,. ACM Press (2004), 711-718.

- 37.Tholander, J. et all. Where All the Interaction Is: Sketching in Interaction Design as an Embodied Practice. In Proc. of DIS, ACM Press (2008), 445-454.

- 38.Wensveen, S. et al. Interaction Frogger: A Design Framework to Couple Action and Function through Feedback and Feedforward. In Proc. of DIS, ACM Press (2004), 177-184
