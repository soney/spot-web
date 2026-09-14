<!-- Source PDF SHA-256: 752f7315180d8d64dd19d077e8604f6c4d716bba959ade5486989b1498ba1c2f -->

<a id="page-1"></a>

# Towards Inclusive Source Code Readability Based on the Preferences of Programmers with Visual Impairments

[Source PDF](https://from.so/assets/pdfs/pandey-inclusive-source-code-chi2024.pdf) · [Publisher page](https://doi.org/10.1145/3613904.3642512)

∗ [Maulishree Pandey](<https://orcid.org/0009-0005-0543-3088>) maupande@umich.edu University of Michigan School of Information Ann Arbor, Michigan, USA

[Steve Oney](<https://orcid.org/0000-0002-5823-1499>) soney@umich.edu University of Michigan School of Information Ann Arbor, Michigan, USA

[Andrew Begel](<https://orcid.org/0000-0002-7425-4818>) abegel@cmu.edu Carnegie Mellon University Software and Societal Systems Department Pittsburgh, PA, USA

<sup>∗</sup>The author is currently a UX researcher at Google. The research was done when she was an a doctoral student at the University of Michigan.

© 2024 Copyright held by the owner/author(s). Publication rights licensed to ACM. ACM ISBN 979-8-4007-0330-0/24/05...$15.00 [https://doi.org/10.1145/3613904.3642512](<https://doi.org/10.1145/3613904.3642512>)

> Permission to make digital or hard copies of all or part of this work for personal or classroom use is granted without fee provided that copies are not made or distributed for profit or commercial advantage and that copies bear this notice and the full citation on the first page. Copyrights for components of this work owned by others than the author(s) must be honored. Abstracting with credit is permitted. To copy otherwise, or republish, to post on servers or to redistribute to lists, requires prior specific permission and/or a fee. Request permissions from permissions@acm.org. CHI ’24, May 11–16, 2024, Honolulu, HI, USA

## ABSTRACT

Code readability is crucial for program comprehension, maintenance, and collaboration. However, many of the standards for writing readable code are derived from sighted developers’ readability needs. We conducted a qualitative study with 16 blind and visually impaired (BVI) developers to better understand their readability preferences for common code formatting rules such as identifier naming conventions, line length, and the use of indentation. Our findings reveal how BVI developers’ preferences contrast with those of sighted developers and how we can expand the existing rules to improve code readability on screen readers. Based on the findings, we contribute an inclusive understanding of code readability and derive implications for programming languages, development environments, and style guides. Our work helps broaden the meaning of readable code in software engineering and accessibility research.

## CCS CONCEPTS

- Human-centered computing → Empirical studies in accessibility; Empirical studies in collaborative and social computing.

## KEYWORDS

software developers, blind or visually impaired, accessibility, code readability

## ACM Reference Format:

Maulishree Pandey, Steve Oney, and Andrew Begel. 2024. Towards Inclusive Source Code Readability Based on the Preferences of Programmers with Visual Impairments. In Proceedings of the CHI Conference on Human Factors in Computing Systems (CHI ’24), May 11–16, 2024, Honolulu, HI, USA. ACM, New York, NY, USA, [17](<#page-17>) pages. [https://doi.org/10.1145/3613904.3642512](<https://doi.org/10.1145/3613904.3642512>)

## 1 INTRODUCTION

Reading code is one of the most fundamental and important activities in software development. Readability is a subjective measurement of how easy it is to go through any given code. More readable code is easier to comprehend and maintain in the long term. Typically, software maintenance comprises 70% of any project’s life cycle \[[15](<#page-12>)\], making it the most intensive aspect of software development projects. Elshoff and Marcotty recommended adding another phase to the software lifecycle just to make the source code more readable \[[23](<#page-12>)\]. They suggested the phase should require developers to apply consistent formatting, leave good comments, and remove unused code blocks. Software companies enforce adherence to coding standards \[[48](<#page-13>)\] and use code reviews to ensure code quality \[[22](<#page-12>)\]. Companies like Google and AirBnb have even made their coding standards public to ensure consistent and readable code contributions from the larger programming community \[[3](<#page-12>), [27](<#page-12>)\]. Others have recommended ensuring the readability of documentation to aid developers in making readable edits to codebases \[[1](<#page-12>), [29](<#page-12>)\]. Some also propose teaching students to write readable code as part of standard programming coursework \[[19](<#page-12>)\].

The focus on readability has led to the development of rich visual design and functionality in code editors. For instance, indentation is long known to improve readability among sighted developers \[[53](<#page-13>)\]. Code editors like Sublime Text, and IntelliJ display vertical lines to visually match indentation levels. IDEs such as VS Code offer mini-maps, which are zoomed out representations of the code structure. Developers can quickly navigate to different code blocks by identifying their shape and relative position in the map.

However, our current understanding of readability is based on the opinions and preferences of sighted developers \[[21](<#page-12>), [36](<#page-12>)\]. Blind and visually impaired (BVI) programmers use assistive technologies (ATs) such as screen readers, which lack the visual expressiveness and information density of graphical user interfaces (GUIs). The serial and ephemeral nature of screen reader output \[[10](<#page-12>)\] leads to different browsing \[[12](<#page-12>)\] and skimming \[[2](<#page-12>)\] strategies among BVI people in comparison to sighted people. These differences between screen readers and GUIs suggest that BVI developers may have different readability preferences from sighted developers. In this paper, we investigate code readability for BVI developers. Specifically, we pose the following research questions:

- (1) RQ1. How and why do the code readability preferences of BVI developers differ from that of sighted developers as identified through literature review (see §[2.2](<#page-2>))?

- (2) RQ2. What implications do these differences have for programming tools such as static analyzers and code editors, code styling guidelines, and programming languages?

<a id="page-2"></a>

We conducted a remote exploratory qualitative study with 16 BVI developers to answer our research questions. During the study, we asked participants to review 15 rules related to code readability (see Table [1](<#page-4>)). We presented two functionally equivalent but differently formatted versions of code snippets for each rule. One version’s presentation was informed by PEP8 \[[63](<#page-13>)\], the official Python style guide, serving as a proxy for sighted developers’ preferences; the second version’s formatting was informed by accessibility research. We asked participants to select their preferred option for each rule. We asked follow-up questions to understand their preferences and concluded with a short semi-structured interview to elicit their experiences with code styling during collaborative activities such as code reviews.

Our research leads to a more inclusive understanding of code readability and makes the following contributions to the fields of HCI, accessibility, and software engineering research:

- A taxonomy for what is good code formatting on screen readers vs. GUIs to support better code readability

- Empirical data to explain how various factors shape code readability on screen readers

- Design recommendations for code editors and programming languages

## 2 RELATED WORK

Buse and Weimer defined code readability as “a human judgement of how easy a text is to understand” \[[17](<#page-12>)\]. Readability is known to improve program comprehension but is distinct from overall understandability of code. For instance, readable code may still be difficult to understand due to unfamiliar APIs, poor documentation, and complexity of source code \[[51](<#page-13>)\]. Sighted developers do not read code linearly. They are far more likely to skim the source code to locate regions of interest where they do more focused reading \[[54](<#page-13>)\]. In this section, we first draw on empirical studies at the overlap of accessibility and programming to explain what we know about code reading, comprehension, and navigation on screen readers. Then we summarize the factors that shape code readability for sighted developers.

### 2.1 Code Reading on Screen Readers

The primary focus of existing HCI and accessibility studies has been on code navigation and comprehension. However, a close review of these papers reveals a few insights about readability.

#### 2.1.1 Linear Navigation.

Prior research suggests that BVI developers want to avoid going through the codebase line by line but are forced to do so to get an overview of the code structure \[[5](<#page-12>)\]. Francioni and Smith developed JavaSpeak to enable BVI developers to acquire details about the code structure and semantics more efficiently \[[25](<#page-12>)\]. JavaSpeak spoke the code with different intonations to communicate structure. The researchers also suggested using prosodic elements like speaking rate, pitch, or phrasing to communicate semantic characteristics about code \[[25](<#page-12>)\], a recommendation seconded by Stefik \[[58](<#page-13>)\]. Screen readers like JAWS \[[26](<#page-12>)\] and NVDA \[[35](<#page-12>)\] use prosody to indicate the capitalization, which may come in handy during programming.

Stefik suggested using audio cues to inform BVI developers about the “scoping relationships between pieces of syntax” to communicate the information provided by syntax highlighting \[[58](<#page-13>)\]. An example of Stefik’s suggestion would be the work by Hutchinson and Metatla \[[30](<#page-12>)\]. They designed 12 audio cues to represent different programming constructs, such as the sound of door opening for if blocks and door closing for else blocks \[[30](<#page-12>)\]. The idea was that developers could use the audio cues to skip listening to the entire statement and move through the codebase more efficiently \[[30](<#page-12>)\]. However, BVI participants in the study reported wanting more practice with the audio cues to map them accurately to the constructs. Evidence suggests that skeuomorphic audio cues can help reduce the learning curve \[[43](<#page-13>)\].

Studies suggest that BVI developers avoided indenting code altogether unless collaborating with sighted developers \[[5](<#page-12>), [41](<#page-12>)\]. It makes linear code reading very verbose by announcing all the whitespaces. BVI developers are known to develop custom scripts to minimize the indentation announcement \[[5](<#page-12>)\]. For similar reasons, they prefer to not receive all punctuation announcement \[[9](<#page-12>)\]. One way to address verbosity is by outputting the semantic meaning of a code statement but that can make editing the syntax challenging in real-world projects \[[58](<#page-13>)\]. Thus, researchers have used the approach only for making source code more understandable to novice BVI developers \[[50](<#page-13>), [59](<#page-13>)\]. Lastly, recent evidence shows that poor identifier or variable names affect code reading and debugging on screen readers \[[40](<#page-12>), [41](<#page-12>)\] but we lack perspective on their casing, length, and naming choices.

#### 2.1.2 Non-Linear Navigation.

Sighted people can use an array of methods for non-linear navigation: scroll, point and click, use keyboard shortcuts, utilize IDE features like tree views and mini maps, and keyword search. BVI developers only have a subset of these options available to them to make sweeping jumps through the code \[[43](<#page-13>)\]. Keyword search is reportedly one of the most common methods for code navigation \[[5](<#page-12>), [44](<#page-13>)\]. BVI developers have reported maintaining a document to easily look up variable and function names \[[4](<#page-12>)\]. However, search can be time consuming and frustrating when multiple results pop up for the same keyword \[[5](<#page-12>)\]. BVI developers have to review code statements multiple times to verify they are on the required line \[[5](<#page-12>)\]. As a workaround, they may leave comments to bookmark interesting locations in the code \[[5](<#page-12>)\].

Another common strategy is to jump between function signatures \[[6](<#page-12>), [7](<#page-12>)\]. Audio-based plugins are especially helpful in non-linear navigation. StructJumper provided a hierarchical tree view of the source code’s nested structure to facilitate skimming and non-linear navigation \[[9](<#page-12>)\]. Its evaluation showed that efficient navigation meant BVI developers did not have to remember much of the code during code reading \[[9](<#page-12>)\]. The success of hierarchical trees was extended to support navigation of larger software projects with several files \[[42](<#page-12>), [56](<#page-13>)\].

### 2.2 Factors Affecting Code Readability for Sighted Developers

Prior research suggests that readability for sighted developers depends on the following: (1) use of spacing to make blocks visually distinguishable and easily identifiable using indentation, vertical line breaks, and whitespaces (2) identifier names and their naming style (camel case vs. snake case), (3) line length for source code and comments, and (4) text formatting \[[36](<#page-12>)\]. We discuss these below; Table [1](<#page-4>) summarizes the factors and their sub-factors.

#### 2.2.1 Spacing.

<a id="page-3"></a>

Indentation is one of the most widely used approaches for modifying code layout. Early evidence suggested that as program complexity increased, indentation improved program comprehension \[[18](<#page-12>), [53](<#page-13>)\]. Subsequent studies investigated the optimal amount of indentation that aided in readability without increasing typing effort. For instance, Miara et al. suggested using 2–4 spaces to indent code blocks in Pascal, with 2 spaces offering most readability across developers’ experience levels \[[32](<#page-12>)\]. Furthermore, they found that an overly indented code made scanning difficult. Indentation also had diminishing returns in heavily nested code or when entities were separated by blank lines \[[18](<#page-12>)\]. While developers’ opinions remain undecided between 2 vs. 4 spaces \[[11](<#page-12>), [21](<#page-12>)\], the latter gives the visual appearance of a tab character and may lead to inconsistent use of tabs and spaces during collaboration, causing breakdowns in programming languages such as Python.

Another way to improve source code navigation is through segmenting i.e., putting blanks lines between code blocks that are functionally not similar \[[17](<#page-12>), [49](<#page-13>), [61](<#page-13>), [64](<#page-13>)\]. While it has not been found to have a significant effect on program comprehension and recall \[[31](<#page-12>)\] and developer opinion seems split on the topic \[[21](<#page-12>)\], coding standards recommend the use of vertical space to delineate code blocks \[[63](<#page-13>)\]. Furthermore, the approach is an alternative to more explicit form of coding such as marking the beginnings and ends of code blocks with explicit statements or comments, which makes the code longer and difficult to read \[[60](<#page-13>)\].

Coding standards also recommend using whitespaces around operators to improve legibility at line level \[[63](<#page-13>)\]. While they have not been reported to significantly improve readability \[[49](<#page-13>)\], they are considered good coding practice \[[17](<#page-12>)\].

#### 2.2.2 Identifiers.

Meaningful identifier names (e.g., variable names or function names) have been found to improve readability \[[61](<#page-13>)\] whereas poor naming practices can increase developers’ cognitive load \[[24](<#page-12>)\]. Developers may not follow good naming practices due to differing opinions on what constitutes a good name \[[61](<#page-13>)\], with novice developers more likely to use poor naming choices \[[47](<#page-13>)\].

When it comes to identifiers, the word boundary style also matters. Sharif and Maletic investigated the effect of camel case and snake case on identifier names \[[52](<#page-13>)\]. They found that participants took 13.5% longer to recognize camel case identifiers \[[52](<#page-13>)\]. On the other hand, Binkley et al. \[[14](<#page-12>)\] found that regardless of developer experience, camel casing led to higher accuracy for source code manipulation in Java and C. Their follow-up study found that beginners recalled camel cased identifiers better whereas experts recalled better with snaked case. However, there was no statistically significant difference in visual effort needed for both styles \[[13](<#page-12>)\]. Furthermore, regardless of the word boundary, longer names took more time to be recognized \[[14](<#page-12>)\].

#### 2.2.3 Line Length.

Readability also depends on line length. Long lines of code are more difficult to understand, much like long sentences. Most coding standards recommend limiting lines to 79 characters \[[63](<#page-13>)\]. It allows sighted developers to open multiple editor windows side by side and avoid horizontally scrolling \[[21](<#page-12>)\]. Some researchers have even recommended that programming languages should favor constructs that allow developers to write shorter lines of code, for example using pre and post increments (e.g., i++) instead of addition operations (e.g., i = i + 1) \[[17](<#page-12>)\].

Coding standards such as PEP8 typically recommend a shorter line length of 72 characters for more free flowing text such as comments and docstrings, which are strings used to document functions and classes \[[63](<#page-13>)\]. Comments are especially useful in large non-modular code \[[62](<#page-13>)\]. Developers are encouraged to use comments sparingly and write them in simple language \[[57](<#page-13>)\], while ideally writing code where the intent is apparent without the need for additional explanations \[[28](<#page-12>)\].

#### 2.2.4 Text Formatting.

Readability for sighted people is shaped by legibility of the displayed text, which comprises layout (discussed above) and text formatting characteristics. Good legibility is related to readers’ spatial visual abilities \[[65](<#page-13>)\]. Depending on one’s visual acuity, one needs to modify formatting attributes such as font type, contrast, font size, etc. to maximize the legibility of readable text \[[65](<#page-13>)\]. For instance, Baecker applied the principles of graphic design to C programs \[[8](<#page-12>)\]. He relied on different font types, proportional character spacing, and color contrast to improve the parsing of complex statements and special symbols by 25%, as measured by performance on a comprehension test \[[8](<#page-12>)\]. Similarly, Raymond explored the use of typography to enhance readability \[[46](<#page-13>)\]. Code editors set the formatting characteristics to reasonable defaults and these can be personalized by sighted developers to their liking. Among the factors discussed above, visual formatting is least relevant to BVI developers. They do not use text formatting attributes such as font size, font family, and colors on screen readers.

Modern code editors offer syntax highlighting and auto indentation to help sighted developers in identifying areas of interest. Static analysis tools such as code linters flag departures from coding standards such as line length violations or poor indentation without having to run the code. Together, these features facilitate skimming and focused reading for sighted developers. But we know little about how BVI developers identify areas of interest and what helps them in focused reading. Our study attempts to address that gap.

## 3 STUDY DESIGN

We conducted a remote exploratory qualitative study with 16 BVI developers to understand their preferences and perspectives on factors that impacted code readability. Studies lasted between 58 to 90 minutes.

### 3.1 Participants

We obtained IRB approval from the university for our study. We recruited our participants through snowball sampling and on-line forums such as program-l, a mailing list primarily comprising BVI developers \[[45](<#page-13>)\]. The eligibility criteria for participation were that developers should be 18 years or older, possess at least one year of experience programming with screen readers, and be able to communicate about code in spoken English. Since code styling guidelines vary across programming languages, we selected Python and JavaScript for the study. Our choice was informed by the immense and consistent popularity of both programming languages in the developer community \[[38](<#page-12>), [39](<#page-12>)\].

We circulated a questionnaire to screen participants who met our eligibility criteria. The questionnaire asked respondents to self-report their programming experience in Python and JavaScript on a scale of 1 to 5; 1 meant no experience and 5 meant expertise in

<a id="page-4"></a>

Table 1: Readability factors we considered in our study. #O1 and #O2 indicate the number of participants who chose option 1 and option 2 respectively for any factor/sub-factor combination. #O3 indicates participants who found both options equally readable or proposed a third alternative. Last column is a sum of O1 – O3 and equals the total number of participants in our study

<table>
  <thead>
    <tr>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-0-0-59933c93" scope="col">Factor</th>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-0-1-fffd8491" scope="col">Sub-Factor</th>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-0-2-070d441e" scope="col">Code Type</th>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-0-3-40a6a75a" scope="col">Option 1 (O1)</th>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-0-4-16fe43cf" scope="col"># O1</th>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-0-5-7ef257ad" scope="col">Option 2 (O2)</th>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-0-6-a3ed1858" scope="col"># O2</th>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-0-7-62cab711" scope="col"># O3</th>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-0-8-11d60884" scope="col"># Sum</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247" scope="row" rowspan="5" headers="pdf-table-840:0-0cfbaa54-table-4-2-0-0-59933c93">Spacing</th>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-1-1-ba51c36f" scope="row" rowspan="2" headers="pdf-table-840:0-0cfbaa54-table-4-2-0-1-fffd8491 pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247">Indentation</th>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-1-2-c2b8afb6" scope="row" headers="pdf-table-840:0-0cfbaa54-table-4-2-0-2-070d441e pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-1-1-ba51c36f">Nested Data Structures</th>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-3-40a6a75a pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-1-1-ba51c36f pdf-table-840:0-0cfbaa54-table-4-2-1-2-c2b8afb6">Separate parentheses and key-value pairs</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-4-16fe43cf pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-1-1-ba51c36f pdf-table-840:0-0cfbaa54-table-4-2-1-2-c2b8afb6">12</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-5-7ef257ad pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-1-1-ba51c36f pdf-table-840:0-0cfbaa54-table-4-2-1-2-c2b8afb6">Match key-value pairs and parentheses</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-6-a3ed1858 pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-1-1-ba51c36f pdf-table-840:0-0cfbaa54-table-4-2-1-2-c2b8afb6">4</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-7-62cab711 pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-1-1-ba51c36f pdf-table-840:0-0cfbaa54-table-4-2-1-2-c2b8afb6">0</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-8-11d60884 pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-1-1-ba51c36f pdf-table-840:0-0cfbaa54-table-4-2-1-2-c2b8afb6">16</td>
    </tr>
    <tr>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-2-2-d0fa3fae" scope="row" headers="pdf-table-840:0-0cfbaa54-table-4-2-0-2-070d441e pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-1-1-ba51c36f">Docstrings</th>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-3-40a6a75a pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-1-1-ba51c36f pdf-table-840:0-0cfbaa54-table-4-2-2-2-d0fa3fae">Indent docstring arguments</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-4-16fe43cf pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-1-1-ba51c36f pdf-table-840:0-0cfbaa54-table-4-2-2-2-d0fa3fae">4</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-5-7ef257ad pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-1-1-ba51c36f pdf-table-840:0-0cfbaa54-table-4-2-2-2-d0fa3fae">Do not indent docstring arguments</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-6-a3ed1858 pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-1-1-ba51c36f pdf-table-840:0-0cfbaa54-table-4-2-2-2-d0fa3fae">9</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-7-62cab711 pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-1-1-ba51c36f pdf-table-840:0-0cfbaa54-table-4-2-2-2-d0fa3fae">3</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-8-11d60884 pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-1-1-ba51c36f pdf-table-840:0-0cfbaa54-table-4-2-2-2-d0fa3fae">16</td>
    </tr>
    <tr>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-3-1-30ce7c24" scope="row" headers="pdf-table-840:0-0cfbaa54-table-4-2-0-1-fffd8491 pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247">Segmenting</th>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-2-070d441e pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-3-1-30ce7c24">–</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-3-40a6a75a pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-3-1-30ce7c24">Use two blank lines to separate entities</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-4-16fe43cf pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-3-1-30ce7c24">4</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-5-7ef257ad pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-3-1-30ce7c24">Use single blank lines</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-6-a3ed1858 pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-3-1-30ce7c24">12</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-7-62cab711 pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-3-1-30ce7c24">0</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-8-11d60884 pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-3-1-30ce7c24">16</td>
    </tr>
    <tr>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-4-1-eb6f66c3" scope="row" rowspan="2" headers="pdf-table-840:0-0cfbaa54-table-4-2-0-1-fffd8491 pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247">Whitespaces</th>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-4-2-3d2bdda0" scope="row" headers="pdf-table-840:0-0cfbaa54-table-4-2-0-2-070d441e pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-4-1-eb6f66c3">Mathematical Operators</th>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-3-40a6a75a pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-4-1-eb6f66c3 pdf-table-840:0-0cfbaa54-table-4-2-4-2-3d2bdda0">Surround operators with whitespaces</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-4-16fe43cf pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-4-1-eb6f66c3 pdf-table-840:0-0cfbaa54-table-4-2-4-2-3d2bdda0">10</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-5-7ef257ad pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-4-1-eb6f66c3 pdf-table-840:0-0cfbaa54-table-4-2-4-2-3d2bdda0">Avoid whitespaces</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-6-a3ed1858 pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-4-1-eb6f66c3 pdf-table-840:0-0cfbaa54-table-4-2-4-2-3d2bdda0">3</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-7-62cab711 pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-4-1-eb6f66c3 pdf-table-840:0-0cfbaa54-table-4-2-4-2-3d2bdda0">3</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-8-11d60884 pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-4-1-eb6f66c3 pdf-table-840:0-0cfbaa54-table-4-2-4-2-3d2bdda0">16</td>
    </tr>
    <tr>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-5-2-b4226982" scope="row" headers="pdf-table-840:0-0cfbaa54-table-4-2-0-2-070d441e pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-4-1-eb6f66c3">Slice Operators</th>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-3-40a6a75a pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-4-1-eb6f66c3 pdf-table-840:0-0cfbaa54-table-4-2-5-2-b4226982">Surround operator with whitespaces</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-4-16fe43cf pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-4-1-eb6f66c3 pdf-table-840:0-0cfbaa54-table-4-2-5-2-b4226982">10</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-5-7ef257ad pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-4-1-eb6f66c3 pdf-table-840:0-0cfbaa54-table-4-2-5-2-b4226982">Avoid whitespaces</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-6-a3ed1858 pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-4-1-eb6f66c3 pdf-table-840:0-0cfbaa54-table-4-2-5-2-b4226982">5</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-7-62cab711 pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-4-1-eb6f66c3 pdf-table-840:0-0cfbaa54-table-4-2-5-2-b4226982">1</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-8-11d60884 pdf-table-840:0-0cfbaa54-table-4-2-1-0-8f8c3247 pdf-table-840:0-0cfbaa54-table-4-2-4-1-eb6f66c3 pdf-table-840:0-0cfbaa54-table-4-2-5-2-b4226982">16</td>
    </tr>
    <tr>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-6-0-a7785027" scope="row" rowspan="3" headers="pdf-table-840:0-0cfbaa54-table-4-2-0-0-59933c93">Identifiers</th>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-6-1-01604214" scope="row" headers="pdf-table-840:0-0cfbaa54-table-4-2-0-1-fffd8491 pdf-table-840:0-0cfbaa54-table-4-2-6-0-a7785027">Word Boundaries</th>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-2-070d441e pdf-table-840:0-0cfbaa54-table-4-2-6-0-a7785027 pdf-table-840:0-0cfbaa54-table-4-2-6-1-01604214">–</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-3-40a6a75a pdf-table-840:0-0cfbaa54-table-4-2-6-0-a7785027 pdf-table-840:0-0cfbaa54-table-4-2-6-1-01604214">Use snake case</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-4-16fe43cf pdf-table-840:0-0cfbaa54-table-4-2-6-0-a7785027 pdf-table-840:0-0cfbaa54-table-4-2-6-1-01604214">2</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-5-7ef257ad pdf-table-840:0-0cfbaa54-table-4-2-6-0-a7785027 pdf-table-840:0-0cfbaa54-table-4-2-6-1-01604214">Use camel case</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-6-a3ed1858 pdf-table-840:0-0cfbaa54-table-4-2-6-0-a7785027 pdf-table-840:0-0cfbaa54-table-4-2-6-1-01604214">10</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-7-62cab711 pdf-table-840:0-0cfbaa54-table-4-2-6-0-a7785027 pdf-table-840:0-0cfbaa54-table-4-2-6-1-01604214">4</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-8-11d60884 pdf-table-840:0-0cfbaa54-table-4-2-6-0-a7785027 pdf-table-840:0-0cfbaa54-table-4-2-6-1-01604214">16</td>
    </tr>
    <tr>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-7-1-5f973e81" scope="row" headers="pdf-table-840:0-0cfbaa54-table-4-2-0-1-fffd8491 pdf-table-840:0-0cfbaa54-table-4-2-6-0-a7785027">Length</th>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-2-070d441e pdf-table-840:0-0cfbaa54-table-4-2-6-0-a7785027 pdf-table-840:0-0cfbaa54-table-4-2-7-1-5f973e81">–</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-3-40a6a75a pdf-table-840:0-0cfbaa54-table-4-2-6-0-a7785027 pdf-table-840:0-0cfbaa54-table-4-2-7-1-5f973e81">Long variable name</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-4-16fe43cf pdf-table-840:0-0cfbaa54-table-4-2-6-0-a7785027 pdf-table-840:0-0cfbaa54-table-4-2-7-1-5f973e81">13</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-5-7ef257ad pdf-table-840:0-0cfbaa54-table-4-2-6-0-a7785027 pdf-table-840:0-0cfbaa54-table-4-2-7-1-5f973e81">Short variable name</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-6-a3ed1858 pdf-table-840:0-0cfbaa54-table-4-2-6-0-a7785027 pdf-table-840:0-0cfbaa54-table-4-2-7-1-5f973e81">0</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-7-62cab711 pdf-table-840:0-0cfbaa54-table-4-2-6-0-a7785027 pdf-table-840:0-0cfbaa54-table-4-2-7-1-5f973e81">3</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-8-11d60884 pdf-table-840:0-0cfbaa54-table-4-2-6-0-a7785027 pdf-table-840:0-0cfbaa54-table-4-2-7-1-5f973e81">16</td>
    </tr>
    <tr>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-8-1-8b3ecebb" scope="row" headers="pdf-table-840:0-0cfbaa54-table-4-2-0-1-fffd8491 pdf-table-840:0-0cfbaa54-table-4-2-6-0-a7785027">Intent</th>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-2-070d441e pdf-table-840:0-0cfbaa54-table-4-2-6-0-a7785027 pdf-table-840:0-0cfbaa54-table-4-2-8-1-8b3ecebb">–</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-3-40a6a75a pdf-table-840:0-0cfbaa54-table-4-2-6-0-a7785027 pdf-table-840:0-0cfbaa54-table-4-2-8-1-8b3ecebb">Use consistent prefixes</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-4-16fe43cf pdf-table-840:0-0cfbaa54-table-4-2-6-0-a7785027 pdf-table-840:0-0cfbaa54-table-4-2-8-1-8b3ecebb">2</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-5-7ef257ad pdf-table-840:0-0cfbaa54-table-4-2-6-0-a7785027 pdf-table-840:0-0cfbaa54-table-4-2-8-1-8b3ecebb">Use consistent suffixes</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-6-a3ed1858 pdf-table-840:0-0cfbaa54-table-4-2-6-0-a7785027 pdf-table-840:0-0cfbaa54-table-4-2-8-1-8b3ecebb">12</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-7-62cab711 pdf-table-840:0-0cfbaa54-table-4-2-6-0-a7785027 pdf-table-840:0-0cfbaa54-table-4-2-8-1-8b3ecebb">2</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-8-11d60884 pdf-table-840:0-0cfbaa54-table-4-2-6-0-a7785027 pdf-table-840:0-0cfbaa54-table-4-2-8-1-8b3ecebb">16</td>
    </tr>
    <tr>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89" scope="row" rowspan="6" headers="pdf-table-840:0-0cfbaa54-table-4-2-0-0-59933c93">Line Length</th>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-1-fffd8491 pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89">–</td>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-9-2-a17392af" scope="row" headers="pdf-table-840:0-0cfbaa54-table-4-2-0-2-070d441e pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89">Function Calls</th>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-3-40a6a75a pdf-table-840:0-0cfbaa54-table-4-2-9-2-a17392af pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89">Render arguments on separate lines</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-4-16fe43cf pdf-table-840:0-0cfbaa54-table-4-2-9-2-a17392af pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89">8</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-5-7ef257ad pdf-table-840:0-0cfbaa54-table-4-2-9-2-a17392af pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89">Render arguments on same line</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-6-a3ed1858 pdf-table-840:0-0cfbaa54-table-4-2-9-2-a17392af pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89">6</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-7-62cab711 pdf-table-840:0-0cfbaa54-table-4-2-9-2-a17392af pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89">2</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-8-11d60884 pdf-table-840:0-0cfbaa54-table-4-2-9-2-a17392af pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89">16</td>
    </tr>
    <tr>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-1-fffd8491 pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89">–</td>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-10-2-1904fe1f" scope="row" headers="pdf-table-840:0-0cfbaa54-table-4-2-0-2-070d441e pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89">Function Signatures</th>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-3-40a6a75a pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-10-2-1904fe1f">Render arguments on separate lines</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-4-16fe43cf pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-10-2-1904fe1f">10</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-5-7ef257ad pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-10-2-1904fe1f">Render arguments on same line</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-6-a3ed1858 pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-10-2-1904fe1f">5</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-7-62cab711 pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-10-2-1904fe1f">1</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-8-11d60884 pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-10-2-1904fe1f">16</td>
    </tr>
    <tr>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-1-fffd8491 pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89">–</td>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-11-2-24cebffb" scope="row" headers="pdf-table-840:0-0cfbaa54-table-4-2-0-2-070d441e pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89">Chaining</th>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-3-40a6a75a pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-11-2-24cebffb">Treat dot operator as a delimiter</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-4-16fe43cf pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-11-2-24cebffb">14</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-5-7ef257ad pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-11-2-24cebffb">Do not treat dot operator as a delimiter</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-6-a3ed1858 pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-11-2-24cebffb">1</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-7-62cab711 pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-11-2-24cebffb">1</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-8-11d60884 pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-11-2-24cebffb">16</td>
    </tr>
    <tr>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-1-fffd8491 pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89">–</td>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-12-2-75ac6700" scope="row" headers="pdf-table-840:0-0cfbaa54-table-4-2-0-2-070d441e pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89">Binary Operations</th>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-3-40a6a75a pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-12-2-75ac6700">Place line break before the operator</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-4-16fe43cf pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-12-2-75ac6700">7</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-5-7ef257ad pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-12-2-75ac6700">Place line break after the operator</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-6-a3ed1858 pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-12-2-75ac6700">4</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-7-62cab711 pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-12-2-75ac6700">5</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-8-11d60884 pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-12-2-75ac6700">16</td>
    </tr>
    <tr>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-1-fffd8491 pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89">–</td>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-13-2-dbe1a52a" scope="row" headers="pdf-table-840:0-0cfbaa54-table-4-2-0-2-070d441e pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89">Comments</th>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-3-40a6a75a pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-13-2-dbe1a52a">Split comment across lines</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-4-16fe43cf pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-13-2-dbe1a52a">3</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-5-7ef257ad pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-13-2-dbe1a52a">Do not split comment</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-6-a3ed1858 pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-13-2-dbe1a52a">12</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-7-62cab711 pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-13-2-dbe1a52a">1</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-8-11d60884 pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-13-2-dbe1a52a">16</td>
    </tr>
    <tr>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-1-fffd8491 pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89">–</td>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-14-2-3e2ed133" scope="row" headers="pdf-table-840:0-0cfbaa54-table-4-2-0-2-070d441e pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89">Imports</th>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-3-40a6a75a pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-14-2-3e2ed133">Place imports on different lines</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-4-16fe43cf pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-14-2-3e2ed133">7</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-5-7ef257ad pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-14-2-3e2ed133">Place imports on the same line</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-6-a3ed1858 pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-14-2-3e2ed133">6</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-7-62cab711 pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-14-2-3e2ed133">3</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-8-11d60884 pdf-table-840:0-0cfbaa54-table-4-2-9-0-b1156b89 pdf-table-840:0-0cfbaa54-table-4-2-14-2-3e2ed133">16</td>
    </tr>
    <tr>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-15-0-293a85c9" scope="row" headers="pdf-table-840:0-0cfbaa54-table-4-2-0-0-59933c93">String Quotes</th>
      <th id="pdf-table-840:0-0cfbaa54-table-4-2-15-1-1fe098e5" scope="row" headers="pdf-table-840:0-0cfbaa54-table-4-2-0-1-fffd8491 pdf-table-840:0-0cfbaa54-table-4-2-15-0-293a85c9">Quote character</th>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-2-070d441e pdf-table-840:0-0cfbaa54-table-4-2-15-0-293a85c9 pdf-table-840:0-0cfbaa54-table-4-2-15-1-1fe098e5">–</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-3-40a6a75a pdf-table-840:0-0cfbaa54-table-4-2-15-0-293a85c9 pdf-table-840:0-0cfbaa54-table-4-2-15-1-1fe098e5">Use single quote</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-4-16fe43cf pdf-table-840:0-0cfbaa54-table-4-2-15-0-293a85c9 pdf-table-840:0-0cfbaa54-table-4-2-15-1-1fe098e5">2</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-5-7ef257ad pdf-table-840:0-0cfbaa54-table-4-2-15-0-293a85c9 pdf-table-840:0-0cfbaa54-table-4-2-15-1-1fe098e5">Use double quotes</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-6-a3ed1858 pdf-table-840:0-0cfbaa54-table-4-2-15-0-293a85c9 pdf-table-840:0-0cfbaa54-table-4-2-15-1-1fe098e5">12</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-7-62cab711 pdf-table-840:0-0cfbaa54-table-4-2-15-0-293a85c9 pdf-table-840:0-0cfbaa54-table-4-2-15-1-1fe098e5">2</td>
      <td headers="pdf-table-840:0-0cfbaa54-table-4-2-0-8-11d60884 pdf-table-840:0-0cfbaa54-table-4-2-15-0-293a85c9 pdf-table-840:0-0cfbaa54-table-4-2-15-1-1fe098e5">16</td>
    </tr>
  </tbody>
</table>

the language. We selected respondents who reported an experience of 3 or higher. We received a total of 20 responses and conducted the study with 16 respondents. All recruited participants reported either equal experience between Python and JavaScript or more programming experience with Python. Therefore, we conducted the study entirely using the Python stimuli. The questionnaire also collected details about participants’ demographics, assistive technology use, and job role (see Table [2](<#page-6>)).

In our final study sample, 14 participants identified as men and 2 identified as women. Participants were between 18 – 38 years old. They were employed as backend developers, full stack developers, tech lead positions, or were pursuing a higher education degree in computer science or a related field. All participants relied on screen readers to interact with digital devices; three participants reported using braille displays in the screening questionnaire but did not utilize them during the study. Specifically for the study, 14 participants used NVDA and 2 used JAWS (see Table [2](<#page-6>)).

### 3.2 Stimuli

<a id="page-5"></a>

The study was conducted remotely on Zoom. During the study, we presented participants with a markdown file that listed 15 code formatting rules based on the factors identified from existing research (see section [2.2](<#page-2>)). For each rule, we provided two functionally equivalent Python code snippets, inspired by Santos and Gerosa’s study design \[[21](<#page-12>)\]. One version conformed to PEP8 standards \[[63](<#page-13>)\] and served as a proxy for sighted developers’ preferences (e.g., indented code block, snake case for identifiers); the other option was either formatted based on the evidence from accessibility research (e.g., unindented code to minimize verbosity) \[[5](<#page-12>)\] or the alternative considered in studies with sighted developers (e.g., camel case for identifiers) \[[52](<#page-13>)\]. We added a rule to understand preferences for quoting strings because we expected it to impact verbosity \[[63](<#page-13>)\] We randomized the order of rules and the order of options before each study session to mitigate learning effects across participants. Table [1](<#page-4>) summarizes the rules and their breakdown across factors that affect readability. Appendix A lists code snippets corresponding to Table [1](<#page-4>) whereas appendix B shows a randomized markdown file presented as stimuli to one of the participants.

### 3.3 Procedure

We asked participants to open the markdown in a code editor of their choice. Table [2](<#page-6>) lists the code editor and the screen reader they used during the study. Participants were told to read each rule and its options as they would naturally go through any code. For each rule, we asked them to share which option they preferred and why. The research coordinator asked follow up questions about how the options affected readability, navigation, and verbosity on screen readers. Participants had the choice of creating alternatives if they did not like either of the two options presented in the markdown. The study concluded with a semi-structured interview to elicit their perspectives about differences in code styling preferences with sighted developers and the workflows they followed to improve code readability during collaboration. We compensated each participant with a USD $60 gift card (or its equivalent in local currency) for their participation.

### 3.4 Analysis

We transcribed the data from each study session. We organized and summed up participants’ choices for each rule. We report these in Table [1](<#page-4>) (columns 5, 7, and 8). We used the transcripts to highlight quotes that explained participants’ choices. We identified emerging as well as missing themes in participants’ reasoning for their choices through analytic memos \[[34](<#page-12>)\] and weekly team check-ins. In round 1, we used descriptive codes \[[34](<#page-12>)\] to organize the themes into the following categories: (1) readability, (2) ease of navigation, (3) typing effort, (4) collaboration, (5) programming tool and screen reader settings. In round 2, we used inductive coding \[[34](<#page-12>)\] to develop sub-themes within each of them, followed by merging of certain themes. We finally ended up with three high-level themes that explain participants’ choices across all factors and form the findings section of our paper.

## 4 FINDINGS

This section along with Table [1](<#page-4>) answers RQ1: how and why do the code readability preferences of BVI developers differ from that of sighted developers as identified through literature review? We explain how length of code (see §[4.1](<#page-5>)), programming environment (see §[4.2](<#page-7>)), and different levels of navigation (see §[4.3](<#page-8>)) shaped preferences across the factors and sub-factors we considered. Participants’ quotes are lightly edited for clarity.

### 4.1 Impact of Line Length on Readability

We open our findings section by discussing how line length and type of code (e.g., function calls, library imports, comments, etc) shaped participants’ code styling preferences.

```
# Option 1: Treat dot operator as a delimiter
def example(session):
    result = (
        session.query(models.Customer.id)
        .filter(models.Customer.account_id == account_id)
        .order_by(models.Customer.id.asc())
        .all()
    )

# Option 2: Do not treat dot operator as a delimiter
def example(session):
    result = (session.query(models.Customer.id).filter
    (models.Customer.account_id == account_id).order_by(
    models.Customer.id.asc()).all())
```

Listing 1: Options presented to participants for call chains

#### 4.1.1 Line Length.

Participants preferred lengthy function calls, signatures, and chained statements to be split across multiple lines instead of single line (e.g., Option #1 in Listing [1](<#page-5>)). PEP8 recommends limiting line length to 79 characters unless teams prefer otherwise \[[63](<#page-13>)\]. The character limit enables sighted developers to open files side by side without horizontally scrolling to read the overflowing text. While our finding is in agreement with PEP8’s guideline, our participants’ choices were driven by reasons of code comprehension. Screen readers are programmed to read out all the content on the line when the cursor reaches it. Participants shared a long and complex line of code, such as a function chain (e.g., Option #2 in Listing [1](<#page-5>)), was difficult to process when read out in one go. To avoid the continuous audio stream, they used the control-right and control-left arrows to read one word at a time. However, that proved to be too slow a reading pace. On the contrary, when code was split across multiple lines, the screen reader read smaller chunks. These were not only easier to process but also gave more control to participants. They could choose which chunk to pause on or skim past without listening to it entirely:

> “So like if they are in the same line like, my mental process cannot process anything. So like this one, if it is split into multiple lines, I just read a part of the content bit by bit \[reads Option #1 of Listing [1](<#page-5>)\]. So this line is not too long so after reading it \[...\] And after processing, I can just move to the next line.” — P15

If the line included complex variable names, participants had to navigate through each character to verify the contents. Here again chunking helped! Participants could get to complex-sounding arguments quickly by first down-arrowing to the chunk they were interested in and then using right and left arrows to verify the characters:

> “I want to read this character by character. Probably I’ll be a little bit more faster because I’m right in the starting of the line, and I don’t need to find that word. Immediately I can start reading, right? From the first character. ” — P11

We noted that participants’ preferences were mediated by the likelihood of code reuse. A few participants pointed out that function signatures could be kept on one line despite its length since one is unlikely to change it. P15 mentioned that keeping function definition on one line enabled him to “just copy the line and paste it”, which he could then populate with the arguments to invoke the function. Typing or copy-pasting the function call in multiple places helped memorize the function definition. The ability to easily recall the code meant they could skip past the signature, which in turn made them prioritize formatting choices that facilitated efficient navigation.

A few participants said that in addition to splitting a lengthy line, they also preferred using named arguments. P8 described his work as a game developer involved function overloads that had up to 15 similar sounding arguments, such as the X, Y, and Z coordinates to map the three dimensional sound. In such cases, splitting the code across lines was not enough to remember the order of arguments. Furthermore, IntelliSense, the code editor feature that displays documentation upon mouse hovers, was not fully accessible to BVI developers:

<a id="page-6"></a>

Table 2: Participants’ Demographic Details and Environment (code editor and screen reader) they used during the study. The first column lists gender and age in brackets (e.g., P1 is 32 years old and identifies as a man)

<table>
  <thead>
    <tr>
      <th id="pdf-table-1044:0-1f3a3db6-table-6-2-0-0-c2ee5eab" scope="col" data-pdf-scope="Both">#</th>
      <th id="pdf-table-1044:0-1f3a3db6-table-6-2-0-1-6723f384" scope="col" headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-0-c2ee5eab">Job Role</th>
      <th id="pdf-table-1044:0-1f3a3db6-table-6-2-0-2-2c64666c" scope="col" headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-0-c2ee5eab">Prog. Experience</th>
      <th id="pdf-table-1044:0-1f3a3db6-table-6-2-0-3-f939f544" scope="col" headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-0-c2ee5eab">Region</th>
      <th id="pdf-table-1044:0-1f3a3db6-table-6-2-0-4-eaed6583" scope="col" headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-0-c2ee5eab">Screen Reader</th>
      <th id="pdf-table-1044:0-1f3a3db6-table-6-2-0-5-80de683b" scope="col" headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-0-c2ee5eab">Punctuation Setting</th>
      <th id="pdf-table-1044:0-1f3a3db6-table-6-2-0-6-39335fab" scope="col" headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-0-c2ee5eab">Indent Reporting</th>
      <th id="pdf-table-1044:0-1f3a3db6-table-6-2-0-7-ec084779" scope="col" headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-0-c2ee5eab">Code Editor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th id="pdf-table-1044:0-1f3a3db6-table-6-2-1-0-e6e0fff6" scope="row" headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-0-c2ee5eab">P1 (32M)</th>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-1-6723f384 pdf-table-1044:0-1f3a3db6-table-6-2-1-0-e6e0fff6">Backend Developer</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-2-2c64666c pdf-table-1044:0-1f3a3db6-table-6-2-1-0-e6e0fff6">10–14 years</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-3-f939f544 pdf-table-1044:0-1f3a3db6-table-6-2-1-0-e6e0fff6">Europe</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-4-eaed6583 pdf-table-1044:0-1f3a3db6-table-6-2-1-0-e6e0fff6">NVDA</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-5-80de683b pdf-table-1044:0-1f3a3db6-table-6-2-1-0-e6e0fff6">All</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-6-39335fab pdf-table-1044:0-1f3a3db6-table-6-2-1-0-e6e0fff6">None</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-7-ec084779 pdf-table-1044:0-1f3a3db6-table-6-2-1-0-e6e0fff6">Notepad++</td>
    </tr>
    <tr>
      <th id="pdf-table-1044:0-1f3a3db6-table-6-2-2-0-f9f031aa" scope="row" headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-0-c2ee5eab">P2 (18M)</th>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-1-6723f384 pdf-table-1044:0-1f3a3db6-table-6-2-2-0-f9f031aa">Student</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-2-2c64666c pdf-table-1044:0-1f3a3db6-table-6-2-2-0-f9f031aa">5–9 years</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-3-f939f544 pdf-table-1044:0-1f3a3db6-table-6-2-2-0-f9f031aa">Canada</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-4-eaed6583 pdf-table-1044:0-1f3a3db6-table-6-2-2-0-f9f031aa">NVDA</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-5-80de683b pdf-table-1044:0-1f3a3db6-table-6-2-2-0-f9f031aa">All</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-6-39335fab pdf-table-1044:0-1f3a3db6-table-6-2-2-0-f9f031aa">Speech</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-7-ec084779 pdf-table-1044:0-1f3a3db6-table-6-2-2-0-f9f031aa">Notepad2</td>
    </tr>
    <tr>
      <th id="pdf-table-1044:0-1f3a3db6-table-6-2-3-0-ff930c9f" scope="row" headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-0-c2ee5eab">P3 (20M)</th>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-1-6723f384 pdf-table-1044:0-1f3a3db6-table-6-2-3-0-ff930c9f">Student</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-2-2c64666c pdf-table-1044:0-1f3a3db6-table-6-2-3-0-ff930c9f">1–4 years</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-3-f939f544 pdf-table-1044:0-1f3a3db6-table-6-2-3-0-ff930c9f">India</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-4-eaed6583 pdf-table-1044:0-1f3a3db6-table-6-2-3-0-ff930c9f">NVDA</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-5-80de683b pdf-table-1044:0-1f3a3db6-table-6-2-3-0-ff930c9f">Most</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-6-39335fab pdf-table-1044:0-1f3a3db6-table-6-2-3-0-ff930c9f">Speech</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-7-ec084779 pdf-table-1044:0-1f3a3db6-table-6-2-3-0-ff930c9f">Notepad</td>
    </tr>
    <tr>
      <th id="pdf-table-1044:0-1f3a3db6-table-6-2-4-0-0b70e80b" scope="row" headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-0-c2ee5eab">P4 (23M)</th>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-1-6723f384 pdf-table-1044:0-1f3a3db6-table-6-2-4-0-0b70e80b">Game Developer</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-2-2c64666c pdf-table-1044:0-1f3a3db6-table-6-2-4-0-0b70e80b">1–4 years</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-3-f939f544 pdf-table-1044:0-1f3a3db6-table-6-2-4-0-0b70e80b">Pakistan</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-4-eaed6583 pdf-table-1044:0-1f3a3db6-table-6-2-4-0-0b70e80b">NVDA</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-5-80de683b pdf-table-1044:0-1f3a3db6-table-6-2-4-0-0b70e80b">All</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-6-39335fab pdf-table-1044:0-1f3a3db6-table-6-2-4-0-0b70e80b">Speech + Tones</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-7-ec084779 pdf-table-1044:0-1f3a3db6-table-6-2-4-0-0b70e80b">VS Code</td>
    </tr>
    <tr>
      <th id="pdf-table-1044:0-1f3a3db6-table-6-2-5-0-2296eeb8" scope="row" headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-0-c2ee5eab">P5 (32M)</th>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-1-6723f384 pdf-table-1044:0-1f3a3db6-table-6-2-5-0-2296eeb8">Backend Developer</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-2-2c64666c pdf-table-1044:0-1f3a3db6-table-6-2-5-0-2296eeb8">20–24 years</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-3-f939f544 pdf-table-1044:0-1f3a3db6-table-6-2-5-0-2296eeb8">Europe</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-4-eaed6583 pdf-table-1044:0-1f3a3db6-table-6-2-5-0-2296eeb8">NVDA</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-5-80de683b pdf-table-1044:0-1f3a3db6-table-6-2-5-0-2296eeb8">All</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-6-39335fab pdf-table-1044:0-1f3a3db6-table-6-2-5-0-2296eeb8">None</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-7-ec084779 pdf-table-1044:0-1f3a3db6-table-6-2-5-0-2296eeb8">VS Code</td>
    </tr>
    <tr>
      <th id="pdf-table-1044:0-1f3a3db6-table-6-2-6-0-a71e801b" scope="row" headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-0-c2ee5eab">P6 (26M)</th>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-1-6723f384 pdf-table-1044:0-1f3a3db6-table-6-2-6-0-a71e801b">Backend Developer</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-2-2c64666c pdf-table-1044:0-1f3a3db6-table-6-2-6-0-a71e801b">1–4 years</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-3-f939f544 pdf-table-1044:0-1f3a3db6-table-6-2-6-0-a71e801b">India</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-4-eaed6583 pdf-table-1044:0-1f3a3db6-table-6-2-6-0-a71e801b">NVDA</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-5-80de683b pdf-table-1044:0-1f3a3db6-table-6-2-6-0-a71e801b">Most</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-6-39335fab pdf-table-1044:0-1f3a3db6-table-6-2-6-0-a71e801b">Tones</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-7-ec084779 pdf-table-1044:0-1f3a3db6-table-6-2-6-0-a71e801b">Notepad</td>
    </tr>
    <tr>
      <th id="pdf-table-1044:0-1f3a3db6-table-6-2-7-0-191205bb" scope="row" headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-0-c2ee5eab">P7 (34M)</th>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-1-6723f384 pdf-table-1044:0-1f3a3db6-table-6-2-7-0-191205bb">Backend Developer</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-2-2c64666c pdf-table-1044:0-1f3a3db6-table-6-2-7-0-191205bb">10–14 years</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-3-f939f544 pdf-table-1044:0-1f3a3db6-table-6-2-7-0-191205bb">South Africa</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-4-eaed6583 pdf-table-1044:0-1f3a3db6-table-6-2-7-0-191205bb">NVDA</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-5-80de683b pdf-table-1044:0-1f3a3db6-table-6-2-7-0-191205bb">Most</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-6-39335fab pdf-table-1044:0-1f3a3db6-table-6-2-7-0-191205bb">Speech</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-7-ec084779 pdf-table-1044:0-1f3a3db6-table-6-2-7-0-191205bb">Notepad++</td>
    </tr>
    <tr>
      <th id="pdf-table-1044:0-1f3a3db6-table-6-2-8-0-680bbb8a" scope="row" headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-0-c2ee5eab">P8 (38M)</th>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-1-6723f384 pdf-table-1044:0-1f3a3db6-table-6-2-8-0-680bbb8a">Game Developer</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-2-2c64666c pdf-table-1044:0-1f3a3db6-table-6-2-8-0-680bbb8a">20–24 years</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-3-f939f544 pdf-table-1044:0-1f3a3db6-table-6-2-8-0-680bbb8a">USA</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-4-eaed6583 pdf-table-1044:0-1f3a3db6-table-6-2-8-0-680bbb8a">NVDA</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-5-80de683b pdf-table-1044:0-1f3a3db6-table-6-2-8-0-680bbb8a">Some</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-6-39335fab pdf-table-1044:0-1f3a3db6-table-6-2-8-0-680bbb8a">Tones</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-7-ec084779 pdf-table-1044:0-1f3a3db6-table-6-2-8-0-680bbb8a">VS Code</td>
    </tr>
    <tr>
      <th id="pdf-table-1044:0-1f3a3db6-table-6-2-9-0-f567f770" scope="row" headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-0-c2ee5eab">P9 (28M)</th>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-1-6723f384 pdf-table-1044:0-1f3a3db6-table-6-2-9-0-f567f770">Full Stack Developer</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-2-2c64666c pdf-table-1044:0-1f3a3db6-table-6-2-9-0-f567f770">10–14 years</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-3-f939f544 pdf-table-1044:0-1f3a3db6-table-6-2-9-0-f567f770">India</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-4-eaed6583 pdf-table-1044:0-1f3a3db6-table-6-2-9-0-f567f770">NVDA</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-5-80de683b pdf-table-1044:0-1f3a3db6-table-6-2-9-0-f567f770">All</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-6-39335fab pdf-table-1044:0-1f3a3db6-table-6-2-9-0-f567f770">Speech</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-7-ec084779 pdf-table-1044:0-1f3a3db6-table-6-2-9-0-f567f770">VS Code</td>
    </tr>
    <tr>
      <th id="pdf-table-1044:0-1f3a3db6-table-6-2-10-0-aab4f4f5" scope="row" headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-0-c2ee5eab">P10 (18M)</th>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-1-6723f384 pdf-table-1044:0-1f3a3db6-table-6-2-10-0-aab4f4f5">Student</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-2-2c64666c pdf-table-1044:0-1f3a3db6-table-6-2-10-0-aab4f4f5">5–9 years</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-3-f939f544 pdf-table-1044:0-1f3a3db6-table-6-2-10-0-aab4f4f5">India</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-4-eaed6583 pdf-table-1044:0-1f3a3db6-table-6-2-10-0-aab4f4f5">NVDA</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-5-80de683b pdf-table-1044:0-1f3a3db6-table-6-2-10-0-aab4f4f5">Some</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-6-39335fab pdf-table-1044:0-1f3a3db6-table-6-2-10-0-aab4f4f5">Speech</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-7-ec084779 pdf-table-1044:0-1f3a3db6-table-6-2-10-0-aab4f4f5">VS Code</td>
    </tr>
    <tr>
      <th id="pdf-table-1044:0-1f3a3db6-table-6-2-11-0-a37b4d99" scope="row" headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-0-c2ee5eab">P11 (24M)</th>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-1-6723f384 pdf-table-1044:0-1f3a3db6-table-6-2-11-0-a37b4d99">Backend Developer</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-2-2c64666c pdf-table-1044:0-1f3a3db6-table-6-2-11-0-a37b4d99">5–9 years</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-3-f939f544 pdf-table-1044:0-1f3a3db6-table-6-2-11-0-a37b4d99">India</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-4-eaed6583 pdf-table-1044:0-1f3a3db6-table-6-2-11-0-a37b4d99">JAWS</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-5-80de683b pdf-table-1044:0-1f3a3db6-table-6-2-11-0-a37b4d99">Most</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-6-39335fab pdf-table-1044:0-1f3a3db6-table-6-2-11-0-a37b4d99">N/A</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-7-ec084779 pdf-table-1044:0-1f3a3db6-table-6-2-11-0-a37b4d99">VS Code</td>
    </tr>
    <tr>
      <th id="pdf-table-1044:0-1f3a3db6-table-6-2-12-0-56863cc1" scope="row" headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-0-c2ee5eab">P12 (29M)</th>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-1-6723f384 pdf-table-1044:0-1f3a3db6-table-6-2-12-0-56863cc1">Tech Lead</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-2-2c64666c pdf-table-1044:0-1f3a3db6-table-6-2-12-0-56863cc1">10–14 years</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-3-f939f544 pdf-table-1044:0-1f3a3db6-table-6-2-12-0-56863cc1">Canada</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-4-eaed6583 pdf-table-1044:0-1f3a3db6-table-6-2-12-0-56863cc1">NVDA</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-5-80de683b pdf-table-1044:0-1f3a3db6-table-6-2-12-0-56863cc1">Some</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-6-39335fab pdf-table-1044:0-1f3a3db6-table-6-2-12-0-56863cc1">None</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-7-ec084779 pdf-table-1044:0-1f3a3db6-table-6-2-12-0-56863cc1">Notepad++</td>
    </tr>
    <tr>
      <th id="pdf-table-1044:0-1f3a3db6-table-6-2-13-0-da1ceea7" scope="row" headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-0-c2ee5eab">P13 (25F)</th>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-1-6723f384 pdf-table-1044:0-1f3a3db6-table-6-2-13-0-da1ceea7">Student</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-2-2c64666c pdf-table-1044:0-1f3a3db6-table-6-2-13-0-da1ceea7">1–4 years</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-3-f939f544 pdf-table-1044:0-1f3a3db6-table-6-2-13-0-da1ceea7">Europe</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-4-eaed6583 pdf-table-1044:0-1f3a3db6-table-6-2-13-0-da1ceea7">NVDA</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-5-80de683b pdf-table-1044:0-1f3a3db6-table-6-2-13-0-da1ceea7">All</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-6-39335fab pdf-table-1044:0-1f3a3db6-table-6-2-13-0-da1ceea7">Tones</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-7-ec084779 pdf-table-1044:0-1f3a3db6-table-6-2-13-0-da1ceea7">Notepad++</td>
    </tr>
    <tr>
      <th id="pdf-table-1044:0-1f3a3db6-table-6-2-14-0-bcd22668" scope="row" headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-0-c2ee5eab">P14 (31F)</th>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-1-6723f384 pdf-table-1044:0-1f3a3db6-table-6-2-14-0-bcd22668">Data Scientist</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-2-2c64666c pdf-table-1044:0-1f3a3db6-table-6-2-14-0-bcd22668">10–14 years</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-3-f939f544 pdf-table-1044:0-1f3a3db6-table-6-2-14-0-bcd22668">USA</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-4-eaed6583 pdf-table-1044:0-1f3a3db6-table-6-2-14-0-bcd22668">JAWS</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-5-80de683b pdf-table-1044:0-1f3a3db6-table-6-2-14-0-bcd22668">Most</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-6-39335fab pdf-table-1044:0-1f3a3db6-table-6-2-14-0-bcd22668">N/A</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-7-ec084779 pdf-table-1044:0-1f3a3db6-table-6-2-14-0-bcd22668">VS Code</td>
    </tr>
    <tr>
      <th id="pdf-table-1044:0-1f3a3db6-table-6-2-15-0-a76c09e3" scope="row" headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-0-c2ee5eab">P15 (37M)</th>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-1-6723f384 pdf-table-1044:0-1f3a3db6-table-6-2-15-0-a76c09e3">Researcher</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-2-2c64666c pdf-table-1044:0-1f3a3db6-table-6-2-15-0-a76c09e3">15–19 years</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-3-f939f544 pdf-table-1044:0-1f3a3db6-table-6-2-15-0-a76c09e3">China</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-4-eaed6583 pdf-table-1044:0-1f3a3db6-table-6-2-15-0-a76c09e3">NVDA</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-5-80de683b pdf-table-1044:0-1f3a3db6-table-6-2-15-0-a76c09e3">All</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-6-39335fab pdf-table-1044:0-1f3a3db6-table-6-2-15-0-a76c09e3">Speech</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-7-ec084779 pdf-table-1044:0-1f3a3db6-table-6-2-15-0-a76c09e3">Notepad++</td>
    </tr>
    <tr>
      <th id="pdf-table-1044:0-1f3a3db6-table-6-2-16-0-cd71681c" scope="row" headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-0-c2ee5eab">P16 (21M)</th>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-1-6723f384 pdf-table-1044:0-1f3a3db6-table-6-2-16-0-cd71681c">Student</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-2-2c64666c pdf-table-1044:0-1f3a3db6-table-6-2-16-0-cd71681c">1–4 years</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-3-f939f544 pdf-table-1044:0-1f3a3db6-table-6-2-16-0-cd71681c">Europe</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-4-eaed6583 pdf-table-1044:0-1f3a3db6-table-6-2-16-0-cd71681c">NVDA</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-5-80de683b pdf-table-1044:0-1f3a3db6-table-6-2-16-0-cd71681c">All</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-6-39335fab pdf-table-1044:0-1f3a3db6-table-6-2-16-0-cd71681c">Tones</td>
      <td headers="pdf-table-1044:0-1f3a3db6-table-6-2-0-7-ec084779 pdf-table-1044:0-1f3a3db6-table-6-2-16-0-cd71681c">Notepad</td>
    </tr>
  </tbody>
</table>

“You \[sighted developers\] all have a lot of cool stuff where you can highlight something with a mouse \[...\] That’s not something we get as blind programmers. I think it’s getting better now ’cause you can do it in VS Code. You can kind of highlight an argument and I think you can press F12, and it will tell you what it goes with. But still it’s not the most intuitive thing \[...\] But I love named arguments, I really adore them!” — P8

We also found tension between participants’ desire to reduce navigation and splitting the code. For instance, a few participants proposed a third option of keeping 2—3 arguments per line instead of one argument on each line. It meant less typing effort compared to the formatted option as well as fewer down arrow presses. P12 shared that the Eclipse IDE offered a way to wrap lines in a manner which is accessible to both screen reader users and GUI users:

“So in Eclipse, sometimes I’ve seen \[...\] a few of the function names, which have a lot of arguments, so they get intended in a way that they fit on the screen. So you might be having one argument in front of the function name, and then here we’ll have a couple of arguments in the second line, then another three arguments in the third line that way. So yes, it provides better readability and better scalability.” — P12

A couple arguments on each line were short enough to process while one navigated downwards without adding vertical length to the code. Others shared that they would prefer a single argument on each line despite it requiring more arrow presses. This not only ensured consistency but also reduced the burden of having to remember that some lines could have multiple arguments, ultimately preventing the loss of information if one skimmed the code too fast. Participants felt that longer but consistent formatting positively shaped code comprehension when they revisited the code after a hiatus.

A few participants also recommended refactoring the code and making it more modular instead of longer function chains, emphasizing participants’ desire for non-linear navigation. A more modular code enables developers to jump across functions, also reported by Albusays et al. \[[5](<#page-12>)\]

#### 4.1.2 Type of Code.

Length of line interacted with type of code in determining participants’ preferences. We included examples to account for different types of code statements: (1) function signatures or definitions (2) function calls (3) function chains (4) comments (5) import statements. Majority of the participants preferred separation for the former three (as discussed in the previous section) whereas the preferences were more divided for the latter two, shaped by the need for consistency, efficient navigation, and less typing.

Participants mentioned that comments were typically written in English without special syntax or characters. They were easier to comprehend even when they exceeded the recommended character length, with our example being 109 characters long (see Rule #3.0.5 Option 2 in Appendix A):

“It’s \[comments\] not that much sensitive that I need to read character by character. Whereas, if it is a code,

<a id="page-7"></a>

Towards Inclusive Source Code Readability Based on the Preferences of Programmers with Visual Impairments syntax, right? That I need to read character by character. So that makes sense to logically break.” — P11

The preference is in contrast with PEP8’s recommendation, which suggests limiting comments to 72 characters for ease of visual consumption \[[63](<#page-13>)\]. Participants also mentioned that ideally comments should be written in plain English because its purpose is to explain the code. However, if a comment was fairly descriptive and listed “2 or 3 different steps” (P2), they would consider breaking them down.

Although we did not include an example, we followed up with participants about their views on inline comments. PEP8 recommends using inline comments sparingly as they can distract from code reading \[[63](<#page-13>)\]. Only select participants said they relied on in-line comments and limited them to “two to five words” (P6). Most participants preferred comments to be on their own line because it tended to interfere with code reading in two ways. First, when participants tried to jump to the end of the code, their screen reader focus got placed at the end of the comment instead. They had to use control-left arrow to go backwards from the comment until they reached the code to “edit the line” (P1), wasting time in inline navigation. Second, they might completely miss the comment when down arrowing “fast through the lines” (P1).

```
# Option 1: Place imports on different lines
import os
import sys
import random
import json

# Option 2: Place imports on the same line
import os, sys, random, json
```

Figure 1: Options presented to participants for import statements

Much like comments, we noted difference in opinions with regard to import statements due to three reasons (see Listing [1](<#page-7>)). First, the participants made a distinction between standard libraries and third-party libraries. Our example included standard Python libraries and a few participants said they were likely to “group them together” (P8) to “get over them quicker with the down arrow” (P1). On the other hand, third party libraries needed to be placed on their own individual lines because one was likely to import a submodule or rename the module:

“They can just import a specific module into the namespace. So then, you do from this import this , or, you know, import this as this” — P2

Second, editing concerns affected choices. A few participants felt that import statements were only typed once, mostly read once at the beginning of the code, and were unlikely to be modified again. Therefore, one could place multiple imports on a single line without compromising readability. Others felt that because imports were typed precisely once, they should in fact be separated out, ultimately affording more convenience if any library had to be removed or replaced:

“if it is one library per line, so that if you just want to remove one of the library, it is more easier.” — P15

Third, participants’ programming experience with other languages had a bearing on their opinions. For instance, P12 recalled that JAVA only permitted placing imports on separate lines. He chose the same option to stay consistent in our study despite describing the practice as a “headache” (P12).

### 4.2 Impact of Programming Environment on Readability

We now elaborate on the effect of screen reader settings such as punctuation settings and synthesizer choice on code readability. We also describe how these settings interacted with the code editor features.

```
# Option 1: Long names
radioButtonHeight = "20"

# Option 2: Short names
radioBtnHt = "20"
```

Figure 2: Options presented to participants for identifier length

The perceived verbosity of code had a bearing on participants’ styling preferences. For instance, certain naming choices required listening to more audio output and slowed down participants. Consider the options we presented to evaluate preferences for identifier length (see Listing [2](<#page-7>)). Sighted developers are likely to read both options as “radio button height”. On the contrary, for our participants, the second option was announced as “radio B T N H T” – a more verbose output despite being fewer characters to type:

> “So would you believe that even though option 2 is shorter, it’s actually longer on the screen reader. Yeah, it’s more syllables. Ain’t that crazy! Because ‘radioButtonHeight’ is 5. But it’s more characters, whereas ‘radioBtnHt’ \[...\] is actually 8.” — P8

Participants shared that a verbose name was harder to remember. Furthermore, they may confuse the output with similar sounding alphabets while skimming. The name may also be mispronounced by differences in capitalization or due to synthesizer choice:

> “API is capital A, capital P, capital I. It’s not a word but people try to use it as a word, so what they do is ‘capital A, small P, small I’ (Api). Then it will not read as API, that’s when I get confused.” — P11 “I had one or two instances, where it will just call out something else. For example, my screen reader will often call out ‘capital A, capital S’ (AS) as American Samoa.” — P12

A funny instance of screen reader mispronunciation was when function signature arguments were rendered on separate lines (see Rule #3.0.2 Option 1 in Appendix A). The signature’s closing parentheses and colon ‘):’ ended up on a separate line. P12 chuckled when it was announced as “sad face”. Such differences made the seemingly shorter option more verbose, harder to remember, and could introduce errors in the code. To avoid these issues, participants had to slow down their navigation and clarify the spelling by reading the variable “character by character” (P11).

<a id="page-8"></a>

We had included examples of names that encoded the context of use in either the suffix (e.g, foregroundColorMenu) or the prefix (menuForegroundColor) of the identifier. Majority of the participants preferred context to be announced first (e.g., menuForegroundColor, footerForegroundColor) to reduce verbosity associated with long names during code skimming. A few participants pointed out that they would prefer foregroundColorMenu only if the code also contained counterparts such as backgroundColorMenu. They felt it would be more useful to glean the global relationship between identifier categories before learning about the specific UI elements they were responsible for. Participants’ comments are reminiscent of Hungarian notation \[[55](<#page-13>)\] and suggest a preference for quick navigation with lower verbosity.

Verbosity was also determined by the screen reader’s punctuation setting. As shown in Table [2](<#page-6>), 8 participants had set their punctuation to all, 5 had set it to most, and 3 had set it to some. All announced every punctuation character but meant greater verbosity, which interfered with reading and processing. On the other hand, most or some was likely to skip over important characters. The setting had a strong bearing on whether to use camel case or snake case. PEP8 recommends snake case i.e., underscores to separate words in variable names (e.g., primary\_address\_apartment) \[[63](<#page-13>)\]. However, if participants’ screen reader punctuation setting was set to most or all, it was announced as “primary line address line apartment” on NVDA (JAWS announces underscore “underline”). On the other hand, when punctuation was set to some, the announcements were same for both options (primary address apartment) but participants had to go through the identifier to ensure the presence of the underscore character. The verification once again meant the slower character-level navigation that interrupted skimming. Therefore, participants spoke of using camel case even if their colleagues preferred snake case:

“I prefer Option 1 (camel case) because, A, it’s shorter and it reads fine \[...\] I like CamelCase for my Python variables. I’ve convinced my colleagues not to judge me for it” — P7

```
# Option 1: Place line break after the operator
income = (gross_wages +
          taxable_interest +
          (dividends - qualified_dividends) -
          ira_deduction -
          student_loan_interest)

# Option 2: Place line break before the operator
income = (gross_wages
          + taxable_interest
          + (dividends - qualified_dividends)
          - ira_deduction
          - student_loan_interest)
```

Figure 3: Options presented to participants to understand line break preferences

The choice of punctuation setting could also skip information relevant for code comprehension. For instance, we asked participants where they would like to insert line breaks in long lines — split the line after the operator or before the operator (see Listing [3](<#page-8>)). Operators placed at the beginning of the line were announced regardless of one’s punctuation setting. However, a less granular punctuation setting did not announce operators placed at the end of the line:

> “If you put the dot at the end, it will not announce, filter dot. It will just announce filter. Because for JAWS, it’s a full stop.” — P11 (punctuation set to most) “It doesn’t read the dash on dividends - qualified\_dividends - So it’s not reading the dashes but that’s my punctuation settings. That’s my own fault.” — P8 (punctuation set to some)

The above quotes reveal how the dot and the subtraction (announced as dash) operators are treated as if they are being used in a text document and not in a coding environment. P10 reasoned that characters like dot and dash are “used for many purposes”. For instance, he shared that not putting whitespaces around the dash operator also mutes its announcement, possibly because it implies a range (e.g., 15-10). Taking into account all of these scenarios is difficult and screen reader developers might have felt that “not announcing them would make sense” (P10) in some and most settings.

Lastly, single quote (‘tick’ on NVDA; ‘apostrophe’ on JAWS) was only announced when punctuation was set to all; double quote (‘quote’ on both NVDA and JAWS) was announced for most and all settings. We noted a strong preference for double quotes among participants because it required less disambiguation and was more likely to be announced. For instance, in the docstring example (Rule #1.1.2 in Appendix A), the screen reader did not announce the single quotes to participants who had not set their punctuation to all. They had to do character-level navigation to verify whether the line was indeed blank or it had characters relevant to code reading:

> “I was sure something is there, but I couldn’t read and I tried to go back. Then I understood there is an apostrophe, like single quotes \[...\] If it is not saying blank, there is something but it is not readable \[to the screen reader\]” — P11

### 4.3 Impact of Navigation on Readability

We identified 5 kinds of navigation that participants used to skim and read the code in detail: (1) character-level, (2) word-level, (3) line-level, (4) entity-level, (5) editor’s search feature. Prior work has investigated the latter two \[[9](<#page-12>), [42](<#page-12>), [56](<#page-13>)\]. We are the first study to describe how the first three shaped readability.

#### 4.3.1 Character-level navigation.

The previous sections discussed how the lack of punctuation information or too much verbosity meant participants had to parse each character of a line to verify details such as spelling and use of special characters. Presence of whitespaces further slowed down participants by increasing the total characters they had to navigate. For the very reason, majority of our participants preferred tabs over spaces to indent code blocks in Python. They could “go over a tab with just one press” (P1) while spaces were four characters. Besides, whitespaces introduced verbosity at character-level navigation:

> “I usually don’t put spaces, because I think that kind of makes it more time consuming. It’s going to keep saying ‘space space and space’ whatever.” — P2

However, participants agreed that whitespaces facilitated better word-level navigation (discussed next). A few participants mentioned that presence of whitespaces prevented over-editing or accidentally deleting characters by acting like buffer. Furthermore, whitespaces around mathematical operators improved the readability for their sighted colleagues, which they prioritized by either using whitespaces while authoring code or reformatting the code using a code formatter according to coding standards.

```
# Option 1: Use whitespaces
ham[lower : upper + offset]

# Option 2: Avoid whitespaces
ham[lower:upper+offset]
```

Figure 4: Options presented to understand use of whitespaces

<a id="page-9"></a>

Towards Inclusive Source Code Readability Based on the Preferences of Programmers with Visual Impairments

#### 4.3.2 Word-level navigation.

Participants shared that presence of whitespaces tended to improve word navigation by acting as “word boundaries” (P1). Some participants also shared that statements comprising slice operations were “read slowly because of the spaces” (P12) (see Listing [4](<#page-8>)). However, whitespaces could cause tensions with one’s punctuation setting. For instance, with whitespaces present and the punctuation set to some, the screen reader did not announce the colon character. Thus, the operation performed in the statement was not communicated. But without the whitespaces, the colon ended up acting as the word boundary and was output by the screen reader, enabling participants to understand the operation without having to resort to character-level navigation:

> “With my \[punctuation\] setting, if there’s no space between the colon and the words, it is reading the colon as well the plus sign. So it’s reading the entire thing properly. But in the first one, it’s not announcing the colon symbol in ‘some’ setting, and it’s treating it as a pause. ‘Lower’, then a pause, then ‘upper’.” — P10

We noticed similar tension when snake case was used for variable names. Underscores acted as word boundaries and allowed participants to jump across individual words despite increasing typing effort and verbosity (when punctuation was set to ‘most’ or ‘all’). P1 shared how he had started preferring camel case once he discovered an NVDA addon that enabled navigation just like snake case did:

> “3–4 years ago someone made an NVDA addon called WordNav, which stops control arrows even in camel case. So in a word, it’s not like you navigate with control-right/left arrows. With this addon, it stops after the first and second word even though they are not separated by anything” — P1

In conclusion, while whitespaces made character-level navigation and typing slower, they improved word-level navigation by acting as boundaries between words. Punctuation and special characters could also act as boundaries but it depended on one’s punctuation setting.

#### 4.3.3 Line-level navigation.

We have already discussed how participants were able to pause at will when lengthy code lines were split. By down arrowing through code chunks, they were able to process the code better and avoid word-level or even character-level navigation. In this section, we discuss how the use of indentation and line breaks shaped overall navigation and code skimming.

NVDA allows four options for indentation reporting: (1) none, (2) tones where higher pitch implies greater indentation (3) speech (e.g., “twelve space” or “four tab”), (4) both speech and tones[1](<#page-9>). 5 participants did not use any indent reporting whereas 13 participants had it turned on (see Table [2](<#page-6>)). We noted that the choice of setting influenced participants’ presentation choices for nested dictionaries but not so much for docstrings. Typically, participants used indentation reporting to “visualize where the things are, how far in they are” (P7). Thus, option 1 was more preferable for Rule #1.1.1. They could down arrow to key-value pairs at the same nested levels and navigate past heavily nested items using the audio cues:

<sup>1</sup>Only P11 and P14 used JAWS in our study. Both did not use indent reporting. They and a few other participants mentioned that JAWS does not offer indent reporting.

“If the indentation is consistent, I could just skip past, like let’s say there’s a list in here. If I don’t need that, I can just skip past that to the next block.” — P2

Participants who did not use indentation reporting were divided in their preferences. They compared the effort it took to write well-indented code with the improvements to readability. Usually, they wrote the code without indentation and formatted it later for the benefit of sighted developers. They felt the lack of announcements led to “a lot of confusion when dealing with more nested structures” (P14) but keeping it turned on interfered with other aspects of their work such as emails, document writing, etc. However, even without indent announcement, a few people preferred option 1 for nested data structures. The placement of parentheses on its own line clearly indicated the beginnings and ends of a nested level. P14 said she left small inline comments after each closing brace to serve as checkpoints. These helped her keep track of nested structures and helped her skim faster. Furthermore, the key bindings in code editors helped participants to jump quickly to opening or closing parentheses. Some participants used addons like IndentNav, which allowed skipping to statements that shared the same nesting level. In Python, it could be used to jump across entities, conditionals, and loops:

“NVDA has this add on called IndentNav, which basically just lets me navigate past code blocks. So sometimes when I’m skimming and if a block does something and I know what it does, I don’t need to go in there, I’ll just skip past the indentation. Go to the next block or whatever, skip past the loop and stuff like that. ”

Majority of the participants preferred no indentation in multiline docstrings irrespective of indent reporting. Since docstrings were similar in nature to comments, they were likely to be read only a handful of times. They preferred going through them quickly to get to the main body of the code. Even while writing docstrings, participants preferred spending as little time as possible in formatting the text compared to other aspects of source code. P14 mentioned using the autoDocstring plugin for VS Code, which provided placeholders for populating details about a class or function. The plugin not only ensured correct formatting but also saved her writing time.

## 5 DISCUSSION

Prior accessibility research has focused on communicating the information encoded in visual markup such as syntax highlighting, code structure, etc. Our research detaches the source code text from its visual appearance. We find that while it is vital to translate the information available in visual markup, the source code itself is not entirely available on screen readers. We answer RQ1 and show that the attributes of source code such as line length, spacing, etc. are warped in screen reader navigation and the programming environment, thereby shaping readability preferences. In this section, we update Table [1](<#page-4>) from related work to move towards an inclusive taxonomy for code readability (see Table [3](<#page-10>)). We also make recommendations for programming tools and code standards, thereby answering RQ2.

<a id="page-10"></a>

<table>
  <thead>
    <tr>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-0-0-95a3adf2" scope="col" rowspan="2">Factor</th>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-0-1-f6b046f8" scope="col" rowspan="2">Sub-Factor</th>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-0-2-3bf12e44" scope="col" rowspan="2">Code Type</th>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd" scope="col" colspan="3">GUI</th>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260" scope="col" colspan="4">Screen Readers</th>
    </tr>
    <tr>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-1-3-bc7c6ae8" scope="col" headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd">Recommended Practice</th>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-1-4-b37d26f1" scope="col" headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd">Skimming</th>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-1-5-061d37dd" scope="col" headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd">Focused Reading</th>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-1-6-7a400f1f" scope="col" headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260">Recommended Practice</th>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-1-7-e93e2aa5" scope="col" headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260">Non-Linear Skimming</th>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-1-8-ec873641" scope="col" headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260">Linear Skimming</th>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-1-9-e7abfdbd" scope="col" headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260">Focused Reading</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71" scope="row" rowspan="5" headers="pdf-table-1307:0-2ee67870-table-10-1-0-0-95a3adf2">Spacing</th>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-2-1-1b012fb8" scope="row" rowspan="2" headers="pdf-table-1307:0-2ee67870-table-10-1-0-1-f6b046f8 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71">Indentation</th>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-2-2-9c6c162f" scope="row" headers="pdf-table-1307:0-2ee67870-table-10-1-0-2-3bf12e44 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-2-1-1b012fb8">Nested Data Structures</th>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-3-bc7c6ae8 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-2-1-1b012fb8 pdf-table-1307:0-2ee67870-table-10-1-2-2-9c6c162f">Follow consistent indenting</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-4-b37d26f1 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-2-1-1b012fb8 pdf-table-1307:0-2ee67870-table-10-1-2-2-9c6c162f">Yes</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-5-061d37dd pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-2-1-1b012fb8 pdf-table-1307:0-2ee67870-table-10-1-2-2-9c6c162f">No</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-6-7a400f1f pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-2-1-1b012fb8 pdf-table-1307:0-2ee67870-table-10-1-2-2-9c6c162f">Follow consistent indenting</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-7-e93e2aa5 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-2-1-1b012fb8 pdf-table-1307:0-2ee67870-table-10-1-2-2-9c6c162f">Yes (with addons)</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-8-ec873641 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-2-1-1b012fb8 pdf-table-1307:0-2ee67870-table-10-1-2-2-9c6c162f">Yes (with indent reporting)</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-9-e7abfdbd pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-2-1-1b012fb8 pdf-table-1307:0-2ee67870-table-10-1-2-2-9c6c162f">No</td>
    </tr>
    <tr>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-3-2-a037620f" scope="row" headers="pdf-table-1307:0-2ee67870-table-10-1-0-2-3bf12e44 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-2-1-1b012fb8">Docstrings</th>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-3-bc7c6ae8 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-2-1-1b012fb8 pdf-table-1307:0-2ee67870-table-10-1-3-2-a037620f">Indent docstring arguments</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-4-b37d26f1 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-2-1-1b012fb8 pdf-table-1307:0-2ee67870-table-10-1-3-2-a037620f">Yes</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-5-061d37dd pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-2-1-1b012fb8 pdf-table-1307:0-2ee67870-table-10-1-3-2-a037620f">No</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-6-7a400f1f pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-2-1-1b012fb8 pdf-table-1307:0-2ee67870-table-10-1-3-2-a037620f">Do not indent docstring arguments</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-7-e93e2aa5 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-2-1-1b012fb8 pdf-table-1307:0-2ee67870-table-10-1-3-2-a037620f">N/A</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-8-ec873641 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-2-1-1b012fb8 pdf-table-1307:0-2ee67870-table-10-1-3-2-a037620f">Yes</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-9-e7abfdbd pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-2-1-1b012fb8 pdf-table-1307:0-2ee67870-table-10-1-3-2-a037620f">No</td>
    </tr>
    <tr>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-4-1-871df0db" scope="row" headers="pdf-table-1307:0-2ee67870-table-10-1-0-1-f6b046f8 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71">Separate Closing Parentheses</th>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-2-3bf12e44 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-4-1-871df0db">-</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-3-bc7c6ae8 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-4-1-871df0db">Separate parentheses and key-value pairs</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-4-b37d26f1 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-4-1-871df0db">N/A</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-5-061d37dd pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-4-1-871df0db">N/A</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-6-7a400f1f pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-4-1-871df0db">Separate parentheses and key-value pairs</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-7-e93e2aa5 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-4-1-871df0db">Yes</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-8-ec873641 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-4-1-871df0db">Yes</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-9-e7abfdbd pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-4-1-871df0db">Yes</td>
    </tr>
    <tr>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-5-1-1e1818de" scope="row" headers="pdf-table-1307:0-2ee67870-table-10-1-0-1-f6b046f8 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71">Segmenting</th>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-2-3bf12e44 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-5-1-1e1818de">-</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-3-bc7c6ae8 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-5-1-1e1818de">Use 2 blank lines to separate entities</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-4-b37d26f1 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-5-1-1e1818de">Yes</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-5-061d37dd pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-5-1-1e1818de">No</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-6-7a400f1f pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-5-1-1e1818de">Use single blank line to separate entities</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-7-e93e2aa5 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-5-1-1e1818de">N/A</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-8-ec873641 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-5-1-1e1818de">Yes</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-9-e7abfdbd pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-5-1-1e1818de">No</td>
    </tr>
    <tr>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-6-1-e55baaf3" scope="row" headers="pdf-table-1307:0-2ee67870-table-10-1-0-1-f6b046f8 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71">Whitespaces</th>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-6-2-9332f632" scope="row" headers="pdf-table-1307:0-2ee67870-table-10-1-0-2-3bf12e44 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-6-1-e55baaf3">Slice and Math Operators</th>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-3-bc7c6ae8 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-6-1-e55baaf3 pdf-table-1307:0-2ee67870-table-10-1-6-2-9332f632">Surround operators with whitespaces</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-4-b37d26f1 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-6-1-e55baaf3 pdf-table-1307:0-2ee67870-table-10-1-6-2-9332f632">N/A</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-5-061d37dd pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-6-1-e55baaf3 pdf-table-1307:0-2ee67870-table-10-1-6-2-9332f632">Yes</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-6-7a400f1f pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-6-1-e55baaf3 pdf-table-1307:0-2ee67870-table-10-1-6-2-9332f632">Surround operators with whitespaces</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-7-e93e2aa5 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-6-1-e55baaf3 pdf-table-1307:0-2ee67870-table-10-1-6-2-9332f632">N/A</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-8-ec873641 pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-6-1-e55baaf3 pdf-table-1307:0-2ee67870-table-10-1-6-2-9332f632">Yes</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-9-e7abfdbd pdf-table-1307:0-2ee67870-table-10-1-2-0-8ed74f71 pdf-table-1307:0-2ee67870-table-10-1-6-1-e55baaf3 pdf-table-1307:0-2ee67870-table-10-1-6-2-9332f632">Yes</td>
    </tr>
    <tr>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-7-0-825f5574" scope="row" rowspan="3" headers="pdf-table-1307:0-2ee67870-table-10-1-0-0-95a3adf2">Identifiers</th>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-7-1-5b678dab" scope="row" headers="pdf-table-1307:0-2ee67870-table-10-1-0-1-f6b046f8 pdf-table-1307:0-2ee67870-table-10-1-7-0-825f5574">Word Boundaries</th>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-2-3bf12e44 pdf-table-1307:0-2ee67870-table-10-1-7-0-825f5574 pdf-table-1307:0-2ee67870-table-10-1-7-1-5b678dab">-</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-3-bc7c6ae8 pdf-table-1307:0-2ee67870-table-10-1-7-0-825f5574 pdf-table-1307:0-2ee67870-table-10-1-7-1-5b678dab">Use snake case</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-4-b37d26f1 pdf-table-1307:0-2ee67870-table-10-1-7-0-825f5574 pdf-table-1307:0-2ee67870-table-10-1-7-1-5b678dab">N/A</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-5-061d37dd pdf-table-1307:0-2ee67870-table-10-1-7-0-825f5574 pdf-table-1307:0-2ee67870-table-10-1-7-1-5b678dab">Same effect</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-6-7a400f1f pdf-table-1307:0-2ee67870-table-10-1-7-0-825f5574 pdf-table-1307:0-2ee67870-table-10-1-7-1-5b678dab">Use camel case</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-7-e93e2aa5 pdf-table-1307:0-2ee67870-table-10-1-7-0-825f5574 pdf-table-1307:0-2ee67870-table-10-1-7-1-5b678dab">N/A</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-8-ec873641 pdf-table-1307:0-2ee67870-table-10-1-7-0-825f5574 pdf-table-1307:0-2ee67870-table-10-1-7-1-5b678dab">N/A</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-9-e7abfdbd pdf-table-1307:0-2ee67870-table-10-1-7-0-825f5574 pdf-table-1307:0-2ee67870-table-10-1-7-1-5b678dab">Yes</td>
    </tr>
    <tr>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-8-1-51f6af58" scope="row" headers="pdf-table-1307:0-2ee67870-table-10-1-0-1-f6b046f8 pdf-table-1307:0-2ee67870-table-10-1-7-0-825f5574">Length</th>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-2-3bf12e44 pdf-table-1307:0-2ee67870-table-10-1-7-0-825f5574 pdf-table-1307:0-2ee67870-table-10-1-8-1-51f6af58">-</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-3-bc7c6ae8 pdf-table-1307:0-2ee67870-table-10-1-7-0-825f5574 pdf-table-1307:0-2ee67870-table-10-1-8-1-51f6af58">Short variable names</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-4-b37d26f1 pdf-table-1307:0-2ee67870-table-10-1-7-0-825f5574 pdf-table-1307:0-2ee67870-table-10-1-8-1-51f6af58">N/A</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-5-061d37dd pdf-table-1307:0-2ee67870-table-10-1-7-0-825f5574 pdf-table-1307:0-2ee67870-table-10-1-8-1-51f6af58">Yes</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-6-7a400f1f pdf-table-1307:0-2ee67870-table-10-1-7-0-825f5574 pdf-table-1307:0-2ee67870-table-10-1-8-1-51f6af58">Consider syllable count</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-7-e93e2aa5 pdf-table-1307:0-2ee67870-table-10-1-7-0-825f5574 pdf-table-1307:0-2ee67870-table-10-1-8-1-51f6af58">N/A</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-8-ec873641 pdf-table-1307:0-2ee67870-table-10-1-7-0-825f5574 pdf-table-1307:0-2ee67870-table-10-1-8-1-51f6af58">Yes</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-9-e7abfdbd pdf-table-1307:0-2ee67870-table-10-1-7-0-825f5574 pdf-table-1307:0-2ee67870-table-10-1-8-1-51f6af58">Yes</td>
    </tr>
    <tr>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-9-1-2d774760" scope="row" headers="pdf-table-1307:0-2ee67870-table-10-1-0-1-f6b046f8 pdf-table-1307:0-2ee67870-table-10-1-7-0-825f5574">Intent of Use</th>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-2-3bf12e44 pdf-table-1307:0-2ee67870-table-10-1-7-0-825f5574 pdf-table-1307:0-2ee67870-table-10-1-9-1-2d774760">-</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-3-bc7c6ae8 pdf-table-1307:0-2ee67870-table-10-1-7-0-825f5574 pdf-table-1307:0-2ee67870-table-10-1-9-1-2d774760">Convey intent in either prefix or suffix</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-4-b37d26f1 pdf-table-1307:0-2ee67870-table-10-1-7-0-825f5574 pdf-table-1307:0-2ee67870-table-10-1-9-1-2d774760">N/A</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-5-061d37dd pdf-table-1307:0-2ee67870-table-10-1-7-0-825f5574 pdf-table-1307:0-2ee67870-table-10-1-9-1-2d774760">Yes</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-6-7a400f1f pdf-table-1307:0-2ee67870-table-10-1-7-0-825f5574 pdf-table-1307:0-2ee67870-table-10-1-9-1-2d774760">Use consistent suffixes</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-7-e93e2aa5 pdf-table-1307:0-2ee67870-table-10-1-7-0-825f5574 pdf-table-1307:0-2ee67870-table-10-1-9-1-2d774760">N/A</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-8-ec873641 pdf-table-1307:0-2ee67870-table-10-1-7-0-825f5574 pdf-table-1307:0-2ee67870-table-10-1-9-1-2d774760">Yes</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-9-e7abfdbd pdf-table-1307:0-2ee67870-table-10-1-7-0-825f5574 pdf-table-1307:0-2ee67870-table-10-1-9-1-2d774760">Yes</td>
    </tr>
    <tr>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525" scope="row" rowspan="4" headers="pdf-table-1307:0-2ee67870-table-10-1-0-0-95a3adf2">Line Length</th>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-1-f6b046f8 pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525">-</td>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-10-2-36b157df" scope="row" headers="pdf-table-1307:0-2ee67870-table-10-1-0-2-3bf12e44 pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525">Function Calls, Signatures, Chains</th>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-3-bc7c6ae8 pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525 pdf-table-1307:0-2ee67870-table-10-1-10-2-36b157df">Render arguments on separate lines</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-4-b37d26f1 pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525 pdf-table-1307:0-2ee67870-table-10-1-10-2-36b157df">Yes</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-5-061d37dd pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525 pdf-table-1307:0-2ee67870-table-10-1-10-2-36b157df">Yes</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-6-7a400f1f pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525 pdf-table-1307:0-2ee67870-table-10-1-10-2-36b157df">Render arguments on separate lines</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-7-e93e2aa5 pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525 pdf-table-1307:0-2ee67870-table-10-1-10-2-36b157df">N/A</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-8-ec873641 pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525 pdf-table-1307:0-2ee67870-table-10-1-10-2-36b157df">Yes</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-9-e7abfdbd pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525 pdf-table-1307:0-2ee67870-table-10-1-10-2-36b157df">Yes</td>
    </tr>
    <tr>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-1-f6b046f8 pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525">-</td>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-11-2-212ffcad" scope="row" headers="pdf-table-1307:0-2ee67870-table-10-1-0-2-3bf12e44 pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525">Binary Operations</th>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-3-bc7c6ae8 pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525 pdf-table-1307:0-2ee67870-table-10-1-11-2-212ffcad">Place line break before the operator</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-4-b37d26f1 pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525 pdf-table-1307:0-2ee67870-table-10-1-11-2-212ffcad">Yes</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-5-061d37dd pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525 pdf-table-1307:0-2ee67870-table-10-1-11-2-212ffcad">Yes</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-6-7a400f1f pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525 pdf-table-1307:0-2ee67870-table-10-1-11-2-212ffcad">Place line break before the operator or same line</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-7-e93e2aa5 pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525 pdf-table-1307:0-2ee67870-table-10-1-11-2-212ffcad">N/A</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-8-ec873641 pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525 pdf-table-1307:0-2ee67870-table-10-1-11-2-212ffcad">Yes</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-9-e7abfdbd pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525 pdf-table-1307:0-2ee67870-table-10-1-11-2-212ffcad">Yes</td>
    </tr>
    <tr>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-1-f6b046f8 pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525">-</td>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-12-2-9a614fde" scope="row" headers="pdf-table-1307:0-2ee67870-table-10-1-0-2-3bf12e44 pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525">Comments</th>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-3-bc7c6ae8 pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525 pdf-table-1307:0-2ee67870-table-10-1-12-2-9a614fde">Wrap comments</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-4-b37d26f1 pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525 pdf-table-1307:0-2ee67870-table-10-1-12-2-9a614fde">Yes</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-5-061d37dd pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525 pdf-table-1307:0-2ee67870-table-10-1-12-2-9a614fde">Yes</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-6-7a400f1f pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525 pdf-table-1307:0-2ee67870-table-10-1-12-2-9a614fde">Do not split comments</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-7-e93e2aa5 pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525 pdf-table-1307:0-2ee67870-table-10-1-12-2-9a614fde">N/A</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-8-ec873641 pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525 pdf-table-1307:0-2ee67870-table-10-1-12-2-9a614fde">Yes</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-9-e7abfdbd pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525 pdf-table-1307:0-2ee67870-table-10-1-12-2-9a614fde">Yes</td>
    </tr>
    <tr>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-1-f6b046f8 pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525">-</td>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-13-2-41e7eddb" scope="row" headers="pdf-table-1307:0-2ee67870-table-10-1-0-2-3bf12e44 pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525">Imports</th>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-3-bc7c6ae8 pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525 pdf-table-1307:0-2ee67870-table-10-1-13-2-41e7eddb">Place imports on different lines</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-4-b37d26f1 pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525 pdf-table-1307:0-2ee67870-table-10-1-13-2-41e7eddb">Yes</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-5-061d37dd pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525 pdf-table-1307:0-2ee67870-table-10-1-13-2-41e7eddb">Yes</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-6-7a400f1f pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525 pdf-table-1307:0-2ee67870-table-10-1-13-2-41e7eddb">Either is fine</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-7-e93e2aa5 pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525 pdf-table-1307:0-2ee67870-table-10-1-13-2-41e7eddb">N/A</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-8-ec873641 pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525 pdf-table-1307:0-2ee67870-table-10-1-13-2-41e7eddb">Yes</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-9-e7abfdbd pdf-table-1307:0-2ee67870-table-10-1-10-0-e7779525 pdf-table-1307:0-2ee67870-table-10-1-13-2-41e7eddb">Yes</td>
    </tr>
    <tr>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-14-0-d1932fd4" scope="row" headers="pdf-table-1307:0-2ee67870-table-10-1-0-0-95a3adf2">String Quotes</th>
      <th id="pdf-table-1307:0-2ee67870-table-10-1-14-1-135130f7" scope="row" headers="pdf-table-1307:0-2ee67870-table-10-1-0-1-f6b046f8 pdf-table-1307:0-2ee67870-table-10-1-14-0-d1932fd4">Quote Character</th>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-2-3bf12e44 pdf-table-1307:0-2ee67870-table-10-1-14-0-d1932fd4 pdf-table-1307:0-2ee67870-table-10-1-14-1-135130f7">-</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-3-bc7c6ae8 pdf-table-1307:0-2ee67870-table-10-1-14-0-d1932fd4 pdf-table-1307:0-2ee67870-table-10-1-14-1-135130f7">Use quotes consistently</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-4-b37d26f1 pdf-table-1307:0-2ee67870-table-10-1-14-0-d1932fd4 pdf-table-1307:0-2ee67870-table-10-1-14-1-135130f7">N/A</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-3-919faedd pdf-table-1307:0-2ee67870-table-10-1-1-5-061d37dd pdf-table-1307:0-2ee67870-table-10-1-14-0-d1932fd4 pdf-table-1307:0-2ee67870-table-10-1-14-1-135130f7">N/A</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-6-7a400f1f pdf-table-1307:0-2ee67870-table-10-1-14-0-d1932fd4 pdf-table-1307:0-2ee67870-table-10-1-14-1-135130f7">Use double quotes</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-7-e93e2aa5 pdf-table-1307:0-2ee67870-table-10-1-14-0-d1932fd4 pdf-table-1307:0-2ee67870-table-10-1-14-1-135130f7">N/A</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-8-ec873641 pdf-table-1307:0-2ee67870-table-10-1-14-0-d1932fd4 pdf-table-1307:0-2ee67870-table-10-1-14-1-135130f7">Yes</td>
      <td headers="pdf-table-1307:0-2ee67870-table-10-1-0-6-d1be0260 pdf-table-1307:0-2ee67870-table-10-1-1-9-e7abfdbd pdf-table-1307:0-2ee67870-table-10-1-14-0-d1932fd4 pdf-table-1307:0-2ee67870-table-10-1-14-1-135130f7">Yes</td>
    </tr>
  </tbody>
</table>

Table 3: Taxonomy for Code Readability on GUIs and Screen Readers

### 5.1 Moving Towards an Inclusive Taxonomy for Code Readability

#### 5.1.1 Line Length.

Splitting long lines (e.g., function chains, function signatures, etc.) helps both sighted and BVI developers. Sighted developers do not need to horizontally scroll; BVI developers have to process smaller chunks as they read the code. It also improves their navigation experience. They need not listen to the entire line before moving to the following line. It is worth pointing out that sighted developers can toggle on word wrapping, which prevents horizontal scrolling. However, word wrapping produces no effect on BVI developers. In fact, the feature is disabled in IDEs like VS Code if it detects the screen reader \[[33](<#page-12>)\]. Either IDEs should enable an equivalent audio wrapping for screen readers, or they should offer settings to enforce code splitting consistently.

Syntax highlighting helps sighted developers identify regions of interest \[[54](<#page-13>)\]. Researchers have attempted to use audio cues to communicate the visual cues available to sighted developers in code editors. However, audio cues take time to memorize \[[30](<#page-12>)\]. We find that audio cues for indent reporting also interfere with tasks of emailing, document editing, etc for BVI developers. Our findings also show that the type of code matters. Everyone preferred splitting call chains, the opinion was divided on breaking function signatures, and long imports and comments were least likely to affect readability. These findings help us decide what programming constructs should be highlighted using audio.

#### 5.1.2 Programming Environment and Screen Reader Settings.

The manner in which code is written interacts with screen reader settings and affects output. Consider the example where we asked participants whether they prefer inserting line breaks before or after the binary operator. We found that developers were likely to miss operators at the end of lines when skimming too fast or if the punctuation setting was set to most or some. Similarly, screen readers did not announce single quotes in less granular punctuation settings; using double quotes to quote string variables and docstrings was better. Lastly, collaborators may capitalize names differently (e.g., API vs. Api), changing the pronunciation entirely on screen readers. These differences do not affect sighted developers – a quote character is read and interpreted as a quote, missing operators are easy to catch, and API and Api are visually processed the same way. While BVI developers pick up on the code styling preferences of sighted developers easily, sighted developers do not reciprocate similar awareness. We recommend incorporating the readability preferences of BVI developers in code styling guidelines, such as PEP8 \[[63](<#page-13>)\]. For instance, the above examples can be used to educate the larger programming community about how screen readers may announce different code snippets.

<a id="page-11"></a>

We find that code editor plugins and screen reader addons can greatly reduce typing effort while improving readability. For instance, P14 was among the few participants who did not mind indenting docstrings because she used the autoDocstring plugin. Similarly, participants who used addons like IndentNav achieved more efficient non-linear navigation. IDEs like VS Code were more popular because of their accessibility features and ability to apply consistent indentation, parentheses, and quoting. Such plugins and features improved readability as one wrote the code and not after the fact by requiring the use of code formatters. We recommend that teams designing code editors should explore ways to extend the programming environment. The work can be abstracted out at several levels. For examples, JAWS currently does not support indent reporting but IDEs could offer indent reporting through their plugins. IDEs could also provide quick toggles between coding standards suitable for collaboration as well as for personal readability.

Prior research is divided on the use of snake case and camel case for sighted developers \[[14](<#page-12>), [52](<#page-13>)\]. PEP8 recommends snake case for variables \[[63](<#page-13>)\]. But an overwhelming majority of our participants preferred camel case over snake case for verbosity reasons. We also show that developers ought to consider the syllable count when shortening variable names (e.g., button instead of btn; checkbox instead of chkBx) to avoid verbose output. Lastly, developers are encouraged to create meaningful variable names by encoding the intent. In such cases, sighted developers should consider where to place the word representing the intent (e.g, menuColorForeground vs. foregroundColorMenu) to ensure ease of remembrance and code skimming. The decisions should be informed by categories of variables (e.g., foreground colors, background colors, etc), the total number of variables in the code, and the number of words composing the identifier.

#### 5.1.3 Granularity of Navigation.

We add to the prior empirical studies on code navigation with screen readers \[[5](<#page-12>), [9](<#page-12>), [44](<#page-13>)\]. We find that high verbosity and ambiguous announcement of special characters forces people to perform word-level and character-level navigation. These are slower forms of navigation, which impede code reading. Ideally, the lexicon and the layout of the code should be such that it can be understood by line-level navigation. Lines should be chunked such that they are easy to process while reading and easy to recall while navigating backwards. The findings have implications for programming language design. For instance, using complex and verbose keywords can force people to stop skimming and look at the line more closely.

Our finding contradicts past finding on nested code structures \[[5](<#page-12>)\]. We find that participants used indentation for navigation, which was further improved through the use of screen reader addons. We further find that separating parentheses (Option 1 of Rule # 1.1.1) instead of grouping multiple parentheses together (Option 2 of Rule # 1.1.1) is more useful in jumping nested code blocks. Lastly, we find that tabs are better than spaces for indentation because they improve character-level navigation.

When it comes to vertical spacing or segmentation, PEP8 recommends keeping 2 blank lines between entities \[[63](<#page-13>)\]. While a few participants preferred 2 blank lines to delineate between code blocks, most preferred a single line to reduce linear navigation. We believe the choice of vertical spacing can be left up to BVI developers. Code editors could provide shortcuts to reduce blank lines if they detect screen readers to facilitate efficient line-level navigation.

Lack of whitespaces around operators makes the code less readable for sighted developers. For BVI developers, the statement may get read without discernible pauses and may affect word-level navigation due to poor separation of words. Thus, surrounding operators with whitespaces is useful for both groups. Code editors could provide mechanisms to reformat selected group of statements to reduce the typing effort for BVI developers, which they described as the primary reason that deters them from using whitespaces while authoring code.

### 5.2 Limitations and Future Work

We studied participants’ preferences for one programming language (Python). Because readability preferences must exist within languages’ syntactic rules, some of our findings might not generalize to other programming languages. For example, in Python, indentation is an enforced part of the syntax that carries semantic meaning. This is in contrast with most other languages, where indentation is a stylistic choice that can be customized according to developers’ preferences. Python is also closer to English, with some calling it executable pseudocode \[[20](<#page-12>)\]. However, most of our findings relate to syntactic elements that are common across many widely-used programming languages and thus could be generally applicable. However, future work could contrast our results with languages closer to C-style syntax that have been reported to present barriers to novice programmers \[[59](<#page-13>)\].

Participants actual coding practices may differ and are likely to be shaped by existing coding standards and collaboration. Thus, there may be differences in our findings and preferences one may observe in mixed-ability teams.

The remote nature of our study prevented us from observing code reading on braille displays. Only 3 participants reported using braille displays but they did not use them during the study. In future work, we would examine the factors that constitute code readability on braille displays and pin-matrix tactile displays that even display 2D graphics \[[16](<#page-12>)\]. Furthermore, visual impairments exist on a spectrum. We did not analyze how the nature of visual impairment and its onset correlates with participants’ preferences. Consistent with prior accessibility research, instead of focusing on the visual impairment we have derived our recommendations for assistive technologies and programming languages \[[40](<#page-12>), [43](<#page-13>)\].

Despite our efforts, our study sample was heavily skewed towards men and fell within a narrow age range, likely due to the lack of equitable gender and age representation in the software engineering field \[[37](<#page-12>), [38](<#page-12>)\]. Its effect is amplified for BVI women and non-binary developers, who are also marginalized due to ableism and accessibility barriers.

## 6 CONCLUSION

<a id="page-12"></a>

Code editors and IDEs provide features such as syntax highlighting, vertical rulers, etc., to support code skimming and focused reading among sighted developers. However, we do not know what constitutes good code readability for BVI developers. We conducted an exploratory qualitative study with 16 BVI developers. We presented them with two differently formatted options for 15 functionally equivalent Python code snippets and asked them to choose the option that improved code readability for them. The snippets were created to investigate the effect of indentation, line length, identifier names, and quotation characters. We found similarities and differences in how these factors shaped the readability of BVI and sighted developers. Based on the findings, we contribute an inclusive taxonomy for code readability that considers code reading on GUIs and screen readers.

## ACKNOWLEDGMENTS

This study would not have been possible without our participants. We are grateful to them for sharing their experiences and insights with us. We also thank Sile O’Modhrain and Hrishikesh Rao for their time and feedback at various points in this research. The work was supported by a gift from Google.

## REFERENCES

- \[1\] K.K. Aggarwal, Y. Singh, and J.K. Chhabra. 2002. An integrated measure of software maintainability. In Annual Reliability and Maintainability Symposium. 2002 Proceedings (Cat. No.02CH37318). IEEE Press, Seattle, USA, 235–241. [https:](<https://doi.org/10.1109/RAMS.2002.981648>) [//doi.org/10.1109/RAMS.2002.981648](<https://doi.org/10.1109/RAMS.2002.981648>)

- \[2\] Faisal Ahmed, Yevgen Borodin, Andrii Soviak, Muhammad Islam, I.V. Ramakrishnan, and Terri Hedgpeth. 2012. Accessible skimming: faster screen reading of web pages. In Proceedings of the 25th Annual ACM Symposium on User Interface Software and Technology (Cambridge, Massachusetts, USA) (UIST ’12). Association for Computing Machinery, New York, NY, USA, 367–378. [https:](<https://doi.org/10.1145/2380116.2380164>) [//doi.org/10.1145/2380116.2380164](<https://doi.org/10.1145/2380116.2380164>)

- \[3\] AirBnb. 2022. Airbnb React/JSX Style Guide. [https://airbnb.io/javascript/react/](<https://airbnb.io/javascript/react/>)

- \[4\] Khaled Albusays and Stephanie Ludi. 2016. Eliciting programming challenges faced by developers with visual impairments: exploratory study. In Proceedings of the 9th International Workshop on Cooperative and Human Aspects of Software Engineering (Austin, Texas) (CHASE ’16). Association for Computing Machinery, New York, NY, USA, 82–85. [https://doi.org/10.1145/2897586.2897616](<https://doi.org/10.1145/2897586.2897616>)

- \[5\] Khaled Albusays, Stephanie Ludi, and Matt Huenerfauth. 2017. Interviews and observation of blind software developers at work to understand code navigation challenges. In Proceedings of the 19th International ACM SIGACCESS Conference on Computers and Accessibility. Association for Computing Machinery, New York, NY, USA, 91–100.

- \[6\] Ameer Armaly and Collin McMillan. 2016. An empirical study of blindness and program comprehension. In Proceedings of the 38th International Conference on Software Engineering Companion (Austin, Texas) (ICSE ’16). Association for Computing Machinery, New York, NY, USA, 683–685. [https://doi.org/10.1145/](<https://doi.org/10.1145/2889160.2891041>) [2889160.2891041](<https://doi.org/10.1145/2889160.2891041>)

- \[7\] Ameer Armaly, Paige Rodeghero, and Collin McMillan. 2018. A comparison of program comprehension strategies by blind and sighted programmers. In Proceedings of the 40th International Conference on Software Engineering. Association for Computing Machinery, New York, NY, USA, 788–788.

- \[8\] R. Baecker. 1988. Enhancing program readability and comprehensibility with tools for program visualization. In Proceedings of the 10th International Conference on Software Engineering (Singapore) (ICSE ’88). IEEE Computer Society Press, Washington, DC, USA, 356–366.

- \[9\] Catherine M. Baker, Lauren R. Milne, and Richard E. Ladner. 2015. StructJumper: A Tool to Help Blind Programmers Navigate and Understand the Structure of Code. In Proceedings of the 33rd Annual ACM Conference on Human Factors in Computing Systems (Seoul, Republic of Korea) (CHI ’15). Association for Computing Machinery, New York, NY, USA, 3043–3052. [https://doi.org/10.1145/2702123.2702589](<https://doi.org/10.1145/2702123.2702589>)

- \[10\] Mark S Baldwin, Jennifer Mankoff, Bonnie Nardi, and Gillian Hayes. 2020. An activity centered approach to nonvisual computer interaction. ACM Transactions on Computer-Human Interaction (TOCHI) 27, 2 (2020), 1–27.

- \[11\] Jennifer Bauer, Janet Siegmund, Norman Peitek, Johannes C. Hofmeister, and Sven Apel. 2019. Indentation: simply a matter of style or support for program comprehension?. In Proceedings of the 27th International Conference on Program Comprehension (ICPC ’19). IEEE Press, Montreal, Quebec, Canada, 154–164. [https:](<https://doi.org/10.1109/ICPC.2019.00033>) [//doi.org/10.1109/ICPC.2019.00033](<https://doi.org/10.1109/ICPC.2019.00033>)

- \[12\] Jeffrey P. Bigham, Irene Lin, and Saiph Savage. 2017. The Effects of "Not Knowing What You Don’t Know" on Web Accessibility for Blind Web Users. In Proceedings of the 19th International ACM SIGACCESS Conference on Computers and Accessibility (Baltimore, Maryland, USA) (ASSETS ’17). Association for Computing Machinery, New York, NY, USA, 101–109. [https://doi.org/10.1145/3132525.3132533](<https://doi.org/10.1145/3132525.3132533>)

- \[13\] Dave Binkley, Marcia Davis, Dawn Lawrie, Jonathan I Maletic, Christopher Morrell, and Bonita Sharif. 2013. The impact of identifier style on effort and comprehension. Empirical software engineering 18 (2013), 219–276.

- \[14\] Dave Binkley, Marcia Davis, Dawn Lawrie, and Christopher Morrell. 2009. To camelcase or under\_score. In 2009 IEEE 17th International Conference on Program Comprehension. IEEE, Vancouver, BC, Canada, 158–167.

- \[15\] Barry Boehm and Victor R Basili. 2001. Defect reduction top 10 list. Computer 34, 1 (2001), 135–137.

- \[16\] Jens Bornschein, Denise Bornschein, and Gerhard Weber. 2018. Blind Pictionary: Drawing Application for Blind Users. In Extended Abstracts of the 2018 CHI Conference on Human Factors in Computing Systems (Montreal, QC, Canada) (CHI EA ’18). Association for Computing Machinery, New York, NY, USA, 1–4. [https://doi.org/10.1145/3170427.3186487](<https://doi.org/10.1145/3170427.3186487>)

- \[17\] Raymond PL Buse and Westley R Weimer. 2009. Learning a metric for code readability. IEEE Transactions on software engineering 36, 4 (2009), 546–558.

- \[18\] Mitchell H Clifton. 1978. A technique for making structured programs more readable. ACM Sigplan Notices 13, 4 (1978), 58–63.

- \[19\] Lionel E Deimel Jr. 1985. The uses of program reading. ACM SIGCSE Bulletin 17, 2 (1985), 5–14.

- \[20\] Charles Dierbach. 2014. Python as a first programming language. Journal of Computing Sciences in Colleges 29, 3 (2014), 73–73.

- \[21\] Rodrigo Magalhães dos Santos and Marco Aurélio Gerosa. 2018. Impacts of coding practices on readability. In Proceedings of the 26th Conference on Program Comprehension (Gothenburg, Sweden) (ICPC ’18). Association for Computing Machinery, New York, NY, USA, 277–285. [https://doi.org/10.1145/3196321.3196342](<https://doi.org/10.1145/3196321.3196342>)

- \[22\] Carolyn D Egelman, Emerson Murphy-Hill, Elizabeth Kammer, Maggie Morrow Hodges, Collin Green, Ciera Jaspan, and James Lin. 2020. Pushback: Characterizing and Detecting Negative Interpersonal Interactions in Code Review. In Proceedings of the 42nd International Conference on Software Engineering. IEEE/ACM, 174–185.

- \[23\] James L Elshoff and Michael Marcotty. 1982. Improving computer program readability to aid modification. Commun. ACM 25, 8 (1982), 512–521.

- \[24\] Sarah Fakhoury, Yuzhan Ma, Venera Arnaoudova, and Olusola Adesope. 2018. The effect of poor source code lexicon and readability on developers’ cognitive load. In Proceedings of the 26th Conference on Program Comprehension (Gothenburg, Sweden) (ICPC ’18). Association for Computing Machinery, New York, NY, USA, 286–296. [https://doi.org/10.1145/3196321.3196347](<https://doi.org/10.1145/3196321.3196347>)

- \[25\] Joan M. Francioni and Ann C. Smith. 2002. Computer science accessibility for students with visual disabilities. SIGCSE Bull. 34, 1 (Feb 2002), 91–95. [https:](<https://doi.org/10.1145/563517.563372>) [//doi.org/10.1145/563517.563372](<https://doi.org/10.1145/563517.563372>)

- \[26\] Freedom Scientific. 2022. JAWS for Windows. Vispero. [https://www.](<https://www.freedomscientific.com/products/software/jaws/>) [freedomscientific.com/products/software/jaws/](<https://www.freedomscientific.com/products/software/jaws/>)

- \[27\] Google. 2022. ESLint shareable config for the Google JavaScript style guide. [https://github.com/google/eslint-config-google](<https://github.com/google/eslint-config-google>)

- \[28\] Robert Green and Henry Ledgard. 2011. Coding guidelines: Finding the art in the science. Commun. ACM 54, 12 (2011), 57–63.

- \[29\] Nuzhat J Haneef. 1998. Software documentation and readability: a proposed process improvement. ACM SIGSOFT Software Engineering Notes 23, 3 (1998), 75–77.

- \[30\] Joe Hutchinson and Oussama Metatla. 2018. An Initial Investigation into Non-visual Code Structure Overview Through Speech, Non-speech and Spearcons. In Extended Abstracts of the 2018 CHI Conference on Human Factors in Computing Systems (Montreal, QC, Canada) (CHI EA ’18). Association for Computing Machinery, New York, NY, USA, 1–6. [https://doi.org/10.1145/3170427.3188696](<https://doi.org/10.1145/3170427.3188696>)

- \[31\] Tom Love. 1977. An experimental investigation of the effect of program structure on program understanding. ACM SIGSOFT Software Engineering Notes 2, 2 (1977), 105–113. \[32\] Richard J Miara, Joyce A Musselman, Juan A Navarro, and Ben Shneiderman. 1983. Program indentation and comprehensibility. Commun. ACM 26, 11 (1983), 861–867.

- \[33\] Microsoft. 2020. Accessibility in Visual Studio Code. [https://code.visualstudio.](<https://code.visualstudio.com/docs/editor/accessibility#_screen-readers>) [com/docs/editor/accessibility#\_screen-readers](<https://code.visualstudio.com/docs/editor/accessibility#_screen-readers>)

- \[34\] Matthew Miles, A. Michael Huberman, and Michael Saldaña. 2013. Qualitative Data Analysis: A Methods Sourcebook. Sage Publications, Thousand Oaks, CA.

- \[35\] NV Access. 2022. Nonvisual Desktop Access. NV Access. [https://www.nvaccess.](<https://www.nvaccess.org/>) [org/](<https://www.nvaccess.org/>)

- \[36\] Delano Oliveira, Reydne Santos, Fernanda Madeiral, Hidehiko Masuhara, and Fernando Castor. 2023. A systematic literature review on the impact of formatting elements on code legibility. Journal of Systems and Software 203 (2023), 111728. \[37\] Stack Overflow. 2021. Stack overflow developer survey 2021. [https://insights.](<https://insights.stackoverflow.com/survey/2021>) [stackoverflow.com/survey/2021](<https://insights.stackoverflow.com/survey/2021>)

- \[38\] Stack Overflow. 2022. Stack Overflow Developer Survey 2022. [https://survey.](<https://survey.stackoverflow.co/2022/#technology>) [stackoverflow.co/2022/#technology](<https://survey.stackoverflow.co/2022/#technology>)

- \[39\] Stack Overflow. 2023. Stack Overflow Developer Survey 2023. [https://survey.](<https://survey.stackoverflow.co/2023/#technology>) [stackoverflow.co/2023/#technology](<https://survey.stackoverflow.co/2023/#technology>)

- \[40\] Maulishree Pandey, Sharvari Bondre, Sile O’Modhrain, and Steve Oney. 2022. Accessibility of UI Frameworks and Libraries for Programmers with Visual Impairments. In 2022 IEEE Symposium on Visual Languages and Human-Centric Computing (VL/HCC). IEEE Press, Rome, Italy, 1–10.

- \[41\] Maulishree Pandey, Vaishnav Kameswaran, Hrishikesh V. Rao, Sile O’Modhrain, and Steve Oney. 2021. Understanding Accessibility and Collaboration in Programming for People with Visual Impairments. Proc. ACM Hum.-Comput. Interact. 5, CSCW1, Article 129 (apr 2021), 30 pages. [https://doi.org/10.1145/3449203](<https://doi.org/10.1145/3449203>)

- \[42\] Vanessa Petrausch and Claudia Loitsch. 2017. Accessibility analysis of the eclipse ide for users with visual impairment. In Harnessing the Power of Technology to Improve Lives. IOS Press, 922–929.

<a id="page-13"></a>

Towards Inclusive Source Code Readability Based on the Preferences of Programmers with Visual Impairments

- \[43\] Venkatesh Potluri, Maulishree Pandey, Andrew Begel, Michael Barnett, and Scott Reitherman. 2022. CodeWalk: Facilitating Shared Awareness in Mixed-Ability Collaborative Software Development. In Proceedings of the 24th International ACM SIGACCESS Conference on Computers and Accessibility (Athens, Greece) (ASSETS ’22). Association for Computing Machinery, New York, NY, USA, Article 20, 16 pages. [https://doi.org/10.1145/3517428.3544812](<https://doi.org/10.1145/3517428.3544812>)

- \[44\] Venkatesh Potluri, Priyan Vaithilingam, Suresh Iyengar, Y. Vidya, Manohar Swaminathan, and Gopal Srinivasa. 2018. CodeTalk: Improving Programming Environment Accessibility for Visually Impaired Developers. In Proceedings of the 2018 CHI Conference on Human Factors in Computing Systems (Montreal QC, Canada) (CHI ’18). Association for Computing Machinery, New York, NY, USA, 1–11. [https://doi.org/10.1145/3173574.3174192](<https://doi.org/10.1145/3173574.3174192>)

- \[45\] Program-l. 2023. Program-l: V.I. Programmers Discussion List. [https://www.](<https://www.freelists.org/archive/program-l/>) [freelists.org/archive/program-l/](<https://www.freelists.org/archive/program-l/>)

- \[46\] Darrell R Raymond. 1991. Reading source code.. In CASCON, Vol. 91. 3–16.

- \[47\] Phillip A Relf. 2005. Tool assisted identifier naming for improved software readability: an empirical study. In 2005 International Symposium on Empirical Software Engineering, 2005. IEEE, Noosa Heads, QLD, Australia, 10–pp.

- \[48\] Caitlin Sadowski, Emma Söderberg, Luke Church, Michal Sipko, and Alberto Bacchelli. 2018. Modern code review: a case study at google. In Proceedings of the 40th International Conference on Software Engineering: Software Engineering in Practice (Gothenburg, Sweden) (ICSE-SEIP ’18). Association for Computing Machinery, New York, NY, USA, 181–190. [https://doi.org/10.1145/3183519.3183525](<https://doi.org/10.1145/3183519.3183525>)

- \[49\] Isabel Braga Sampaio and Luís Barbosa. 2016. Software readability practices and the importance of their teaching. In 2016 7th International Conference on Information and Communication Systems (ICICS). IEEE Press, Irbid, Jordan, 304– 309.

- \[50\] Jaime Sánchez and Fernando Aguayo. 2005. Blind learners programming through audio. In CHI ’05 Extended Abstracts on Human Factors in Computing Systems (Portland, OR, USA) (CHI EA ’05). Association for Computing Machinery, New York, NY, USA, 1769–1772. [https://doi.org/10.1145/1056808.1057018](<https://doi.org/10.1145/1056808.1057018>)

- \[51\] Simone Scalabrino, Gabriele Bavota, Christopher Vendome, Mario Linares- Vásquez, Denys Poshyvanyk, and Rocco Oliveto. 2017. Automatically assessing code understandability: How far are we?. In 2017 32nd IEEE/ACM International Conference on Automated Software Engineering (ASE). IEEE, Urbana, IL, USA, 417–427.

- \[52\] Bonita Sharif and Jonathan I Maletic. 2010. An eye tracking study on camelcase and under\_score identifier styles. In 2010 IEEE 18th International Conference on Program Comprehension. IEEE Press, Braga, Portugal, 196–205.

- \[53\] Ben Shneiderman and Don McKay. 1976. Experimental Investigations of Computer Program Debugging and Modification. Proceedings of the Human Factors Society Annual Meeting 20, 24 (1976), 557–563. [https://doi.org/10.1177/](<https://doi.org/10.1177/154193127602002401>) [154193127602002401](<https://doi.org/10.1177/154193127602002401>) arXiv:[https://doi.org/10.1177/154193127602002401](<https://arxiv.org/abs/https://doi.org/10.1177/154193127602002401>)

- \[54\] Janet Siegmund, Norman Peitek, Chris Parnin, Sven Apel, Johannes Hofmeister, Christian Kästner, Andrew Begel, Anja Bethmann, and André Brechmann. 2017. Measuring neural efficiency of program comprehension. In Proceedings of the 2017 11th Joint Meeting on Foundations of Software Engineering (Paderborn, Germany) (ESEC/FSE 2017). Association for Computing Machinery, New York, NY, USA, 140–150. [https://doi.org/10.1145/3106237.3106268](<https://doi.org/10.1145/3106237.3106268>)

- \[55\] Charles Simonyi. 1999. Hungarian notation.

- \[56\] Ann C. Smith, Justin S. Cook, Joan M. Francioni, Asif Hossain, Mohd Anwar, and M. Fayezur Rahman. 2003. Nonvisual tool for navigating hierarchical structures. In Proceedings of the 6th International ACM SIGACCESS Conference on Computers and Accessibility (Atlanta, GA, USA) (Assets ’04). Association for Computing Machinery, New York, NY, USA, 133–139. [https://doi.org/10.1145/1028630.1028654](<https://doi.org/10.1145/1028630.1028654>) \[57\] Diomidis Spinellis. 2003. Reading, Writing, and Code: The key to writing readable code is developing good coding style. Queue 1, 7 (2003), 84–89.

- \[58\] Andreas Stefik. 2008. On the design of program execution environments for non-sighted computer programmers. Washington State University (2008).

- \[59\] Andreas Stefik and Susanna Siebert. 2013. An empirical investigation into programming language syntax. ACM Transactions on Computing Education (TOCE) 13, 4 (2013), 1–40.

- \[60\] Floyd Sykes, Raymond T Tillman, and Ben Shneiderman. 1983. The effect of scope delimiters on program comprehension. Software: Practice and Experience 13, 9 (1983), 817–824.

- \[61\] Yahya Tashtoush, Zeinab Odat, Izzat M Alsmadi, and Maryan Yatim. 2013. Impact of programming features on code readability. International Journal of Software Engineering and its Applications 7 (2013), 441–458.

- \[62\] Ted Tenny. 1988. Program readability: Procedures versus comments. IEEE Transactions on Software Engineering 14, 9 (1988), 1271–1279.

- \[63\] Guido van Rossum, Nick Coghlan, and Barry Warsaw. 2001. PEP 8 – Style Guide for Python Code. [https://peps.python.org/pep-0008/](<https://peps.python.org/pep-0008/>)

- \[64\] Xiaoran Wang, Lori Pollock, and K Vijay-Shanker. 2011. Automatic segmentation of method code into meaningful blocks to improve readability. In 2011 18th Working Conference on Reverse Engineering. IEEE, Limerick, Ireland, 35–44.

- \[65\] Silvia Zuffi, Carla Brambilla, Giordano Beretta, and Paolo Scala. 2007. Human computer interaction: Legibility and contrast. In 14th International Conference on Image Analysis and Processing (ICIAP 2007). IEEE, Modena, Italy, 241–246.

## A READABILITY RULES

This section contains code rules and snippets correspond to the factors detailed in Table 1. Next section shows a sample markdown presented to one of the participants.

### # Code Formatting Rules

#### ## 1. Spacing

##### ### 1.1 Indentation

###### #### 1.1.1 Nested Data Structures

Option 1: Keep parentheses and key-value pairs on separate lines

````
```
{
  "menu": {
    "id": "file",
    "value": "File",
    "popup": {
      "menuitem": [
        {
          "value": "New",
          "onclick": "CreateNewDoc()"
        },
        {
          "value": "Open",
          "onclick": "OpenDoc()"
        },
        {
          "value": "Close",
          "onclick": "CloseDoc()"
        }
      ]
    }
  }
}
```
````

Option 2: Match key-value pairs and parentheses

````
```
{"menu": {
  "id": "file",
  "value": "File",
  "popup": {
    "menuitem": [
      {"value": "New", "onclick": "CreateNewDoc()"},
      {"value": "Open", "onclick": "OpenDoc()"},
      {"value": "Close", "onclick": "CloseDoc()"}
    ]}
}}
```
````

###### #### 1.1.2 Multiline docstrings

Option 1: Doctring is not indented

````
```
def add_binary(a, b):
    '''
    Returns the sum of two decimal numbers in binary digits.

    Parameters:
    a (int): A decimal integer
    b (int): Another decimal integer

    Returns: binary_sum (str): Binary string of the
 sum of a and b
    '''
    binary_sum = bin(a+b)[2:]
    return binary_sum
```
````

Option 2: Doctring is indented

````
```
def add_binary(a, b):
    '''
    Returns the sum of two decimal numbers in binary digits.

        Parameters:
                a (int): A decimal integer
````

<a id="page-14"></a>

CHI ’24, May 11–16, 2024, Honolulu, HI, USA

````
                b (int): Another decimal integer

        Returns:
                binary_sum (str): Binary string of the
sum of a and b
    '''
    binary_sum = bin(a+b)[2:]
    return binary_sum
```
````

##### ### 1.2 Segmenting

###### #### 1.2.1 Line breaks in source code

Option 1: Use double empty lines to separate functions, conditionals, and classes

````
```
def factorial(num):
    fact = 1
    for i in range(1, num+1):
        fact = fact * i
    return fact


if condition:
    print("This condition was TRUE")


class Point:
    x: int
    y: int
```
````

Option 2: Use single empty lines between functions, conditionals, and classes

````
```
def factorial(num):
    fact = 1
    for i in range(1, num+1):
        fact = fact * i
    return fact

if condition:
    print("This condition was TRUE")

class Point:
    x: int
    y: int
```
````

##### ### 1.3 Whitespaces

###### #### 1.3.1 Whitespaces in operators

Option 1: Avoid whitespaces before and after operators

````
```
b = config.base**5.2
submitted+=1
hypot2 = x*x+y*y
```
````

Option 2: Surround operators with whitespaces

````
```
b = config.base ** 5.2
submitted += 1
hypot2 = x*x + y*y
```
````

###### #### 1.3.2 Whitespace in slice operators

Option 1: Use whitespaces

````
```
ham[lower : upper + offset]
```
````

Option 2: Avoid whitespaces

````
```
ham[lower:upper+offset]
```
````

#### ## 2. Identifiers

##### ### 2.1 Naming style for variables

Option 1: Use snake case

````
```
primary_address_apartment = ""
```
````

Option 2: Use camel case

````
```
primaryAddressApartment = ""
```
````

##### ### 2.2 Length preference for variable names

Option 1: Long names

````
```
radioButtonHeight = "20"
```
````

Option 2: Short names

````
```
radioBtnHt = "20"
```
````

##### ### 2.3 Consistency in variable names

Option 1: Use consistent prefixes

````
```
foregroundColorMenu = ""
foregroundColorBody = ""
foregroundColorFooter = ""
```
````

Option 2: Use consistent suffixes

````
```
menuForegroundColor = ""
bodyForegroundColor = ""
footerForegroundColor = ""
```
````

#### ## 3. Line Length

##### ### 3.0.1 Formatting function calls

Option 1: Render arguments on the same line

````
```
ImportantClass.important_method(exc, limit, lookup_lines, capture_locals,
extra_argument)
```
````

Option 2: Render arguments on separate lines

````
```
ImportantClass.important_method(
    exc,
    limit,
    lookup_lines,
    capture_locals,
    extra_argument
)
```
````

##### ### 3.0.2 Formatting function signatures

Option 1: Render arguments on separate lines

````
```
# Applies `variables` to the `template` and writes to `file`
def very_important_function(
````

<a id="page-15"></a>

Towards Inclusive Source Code Readability Based on the Preferences of Programmers with Visual Impairments

````
    template: str,
    *variables,
    file: os.PathLike,
    engine: str,
    header: bool = True,
    debug: bool = False,
):
    with open(file, 'w') as f:
    ...
```
````

Option 2: Render arguments on the same line

````
```
# Applies `variables` to the `template` and writes to `file`
def very_important_function(template: str, *variables, file: os.PathLike,
engine: str, header: bool = True, debug: bool = False):
    with open(file, 'w') as f:
    ...
```
````

##### ### 3.0.3 Call chains

Option 1: Treat dot operator as a delimiter

````
```
def example(session):
    result = (
        session.query(models.Customer.id)
        .filter(models.Customer.account_id == account_id)
        .order_by(models.Customer.id.asc())
        .all()
    )
```
````

Option 2: Do not treat dot operator as a delimiter

````
```
def example(session):
   result = (session.query(models.Customer.id).filter(models.Customer.
   account_id == account_id).order_by(models.Customer.id.asc()).all())
```
````

##### ### 3.0.4 Line breaks with binary operators

Option 1: Place line break after the operator

````
```
income = (gross_wages +
          taxable_interest +
          (dividends - qualified_dividends) -
          ira_deduction -
          student_loan_interest)
```
````

Option 2: Place operator after the line break

````
```
income = (gross_wages
          + taxable_interest
          + (dividends - qualified_dividends)
          - ira_deduction
          - student_loan_interest)
```
````

##### ### 3.0.5 Comments

Option 1: Wrap comments across lines

````
```
from collections import defaultdict

def get_top_cities(prices):
    top_cities = defaultdict(int)

    # Count number of times the city was searched for each price range,
    # get the top 3 cities, and add to dictionary
    return dict(top_cities)
```
````

Option 2: Do not wrap comments

````
```
from collections import defaultdict

def get_top_cities(prices):
    top_cities = defaultdict(int)

   # Count number of times the city was searched for each price range, get
    the top 3 cities, and add to dictionary
    return dict(top_cities)
```
````

##### ### 3.0.6 Imports

Option 1: Place imports on different lines

````
```
import os
import sys
import random
import json
```
````

Option 2: Place imports on the same line

````
```
import os, sys, random, json
```
````

#### ## 4. String Quotes

##### ### 4.1 Use of quotation marks in docstrings

Option 1: Use single quotation marks

````
```
def square(n):
    '''Takes in a number n, returns the square of n'''
    return n**2
```
````

Option 2: Use double quotation marks

````
```
def square(n):
    """Takes in a number n, returns the square of n"""
    return n**2
```
````

## B STUDY STIMULUS

This shows a markdown with order of rules and options randomized. The markdown was given to one of the participants as part of the study.

### # Code Formatting Rules

#### ## 1. Length preference for variable names

Option 1: Long names

````
```
radioButtonHeight = "20"
```
````

Option 2: Short names

````
```
radioBtnHt = "20"
```
````

#### ## 2. Consistency in variable names

Option 1: Use consistent prefixes

````
```
foregroundColorMenu = ""
foregroundColorBody = ""
foregroundColorFooter = ""
```
````

Option 2: Use consistent suffixes

````
```
menuForegroundColor = ""
bodyForegroundColor = ""
footerForegroundColor = ""
````

<a id="page-16"></a>

````
```
````

#### ## 3. Whitespace in slice operators

Option 1: Use whitespaces

````
```
ham[lower : upper + offset]
```
````

Option 2: Avoid whitespaces

````
```
ham[lower:upper+offset]
```
````

#### ## 4. Line breaks with binary operators

Option 1: Place operator after the line break

````
```
income = (gross_wages
          + taxable_interest
          + (dividends - qualified_dividends)
          - ira_deduction
          - student_loan_interest)
```
````

Option 2: Place line break after the operator

````
```
income = (gross_wages +
          taxable_interest +
          (dividends - qualified_dividends) -
          ira_deduction -
          student_loan_interest)
```
````

#### ## 5. Formatting function signatures

Option 1: Render arguments on the same line

````
```
# Applies `variables` to the `template` and writes to `file`
def very_important_function(template: str, *variables,
 file: os.PathLike,
engine: str, header: bool = True, debug: bool = False):
    with open(file, 'w') as f:
    ...
```
````

Option 2: Render arguments on separate lines

````
```
# Applies `variables` to the `template` and writes to `file`
def very_important_function(
    template: str,
    *variables,
    file: os.PathLike,
    engine: str,
    header: bool = True,
    debug: bool = False,
):
    with open(file, 'w') as f:
    ...
```
````

#### ## 6. Naming style for variables

Option 1: Use snake case

````
```
primary_address_apartment = ""
```
````

Option 2: Use camel case

````
```
primaryAddressApartment = ""
```
````

#### ## 7. Imports

Option 1: Place imports on the same line

````
```
import os, sys, random, json
````

````
```
````

Option 2: Place imports on different lines

````
```
import os
import sys
import random
import json
```
````

#### ## 8. Use of quotation marks in docstrings

Option 1: Use double quotation marks

````
```
def square(n):
    """Takes in a number n, returns the square of n"""
    return n**2
```
````

Option 2: Use single quotation marks

````
```
def square(n):
    '''Takes in a number n, returns the square of n'''
    return n**2
```
````

#### ## 9. Line breaks in source code

Option 1: Use double empty lines to separate functions, conditionals, and classes

````
```
def factorial(num):
    fact = 1
    for i in range(1, num+1):
        fact = fact * i
    return fact


if condition:
    print("This condition was TRUE")


class Point:
    x: int
    y: int
```
````

Option 2: Use single empty lines between functions, conditionals, and classes

````
```
def factorial(num):
    fact = 1
    for i in range(1, num+1):
        fact = fact * i
    return fact

if condition:
    print("This condition was TRUE")

class Point:
    x: int
    y: int
```
````

#### ## 10. Formatting function calls

Option 1: Render arguments on the same line

````
```
ImportantClass.important_method(exc, limit, lookup_lines, capture_locals,
extra_argument)
```
````

Option 2: Render arguments on separate lines

````
```
ImportantClass.important_method(
    exc,
    limit,
    lookup_lines,
````

<a id="page-17"></a>

Towards Inclusive Source Code Readability Based on the Preferences of Programmers with Visual Impairments

````
    capture_locals,
    extra_argument
)
```
````

#### ## 11. Splitting parentheses

Option 1: Keep parentheses and key-value pairs on separate lines

````
```
{
  "menu": {
    "id": "file",
    "value": "File",
    "popup": {
      "menuitem": [
        {
          "value": "New",
          "onclick": "CreateNewDoc()"
        },
        {
          "value": "Open",
          "onclick": "OpenDoc()"
        },
        {
          "value": "Close",
          "onclick": "CloseDoc()"
        }
      ]
    }
  }
}
```
````

Option 2: Match key-value pairs and parentheses

````
```
{"menu": {
  "id": "file",
  "value": "File",
  "popup": {
    "menuitem": [
      {"value": "New", "onclick": "CreateNewDoc()"},
      {"value": "Open", "onclick": "OpenDoc()"},
      {"value": "Close", "onclick": "CloseDoc()"}
    ]}
}}
```
````

#### ## 12. Multiline docstrings

Option 1: Doctring is indented

````
```
def add_binary(a, b):
    '''
    Returns the sum of two decimal numbers in binary digits.

        Parameters:
                a (int): A decimal integer
                b (int): Another decimal integer

        Returns:
                binary_sum (str): Binary string of the sum of a and b
    '''
    binary_sum = bin(a+b)[2:]
    return binary_sum
```
````

Option 2: Doctring is not indented

````
```
def add_binary(a, b):
    '''
    Returns the sum of two decimal numbers in binary digits.

    Parameters:
    a (int): A decimal integer
    b (int): Another decimal integer

    Returns: binary_sum (str): Binary string of the sum of a and b
    '''
````

````
    binary_sum = bin(a+b)[2:]
    return binary_sum
```
````

#### ## 13. Comments

Option 1: Do not wrap comments

````
```
from collections import defaultdict

def get_top_cities(prices):
    top_cities = defaultdict(int)

    # Count number of times the city was searched for each price range,
    get the top 3 cities, and add to dictionary
    return dict(top_cities)
```
````

Option 2: Wrap comments across lines

````
```
from collections import defaultdict

def get_top_cities(prices):
    top_cities = defaultdict(int)

    # Count number of times the city was searched for each price range,
    # get the top 3 cities, and add to dictionary
    return dict(top_cities)
```
````

#### ## 14. Call chains

Option 1: Treat dot operator as a delimiter

````
```
def example(session):
    result = (
        session.query(models.Customer.id)
        .filter(models.Customer.account_id == account_id)
        .order_by(models.Customer.id.asc())
        .all()
    )
```
````

Option 2: Do not treat dot operator as a delimiter

````
```
def example(session):
   result = (session.query(models.Customer.id).filter(models.Customer.
account_id == account_id).order_by(models.Customer.id.asc()).all())
```
````

#### ## 15. Whitespaces in operators

Option 1: Surround operators with whitespaces

````
```
b = config.base ** 5.2
submitted += 1
hypot2 = x*x + y*y
```
````

Option 2: Avoid whitespaces before and after operators

````
```
b = config.base**5.2
submitted+=1
hypot2 = x*x+y*y
```
````
