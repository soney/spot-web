import * as React from 'react'
import { Helmet } from 'react-helmet';
import './cv.scss'

interface IndexPageProps {
}

export default class extends React.Component<IndexPageProps, {}> {
    constructor(props: IndexPageProps, context: {}) {
        super(props, context);
    }
    public render() {
        return <div className="cv container">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Steve Oney &ndash; Curriculum Vitae</title>
                    <link rel="stylesheet" href="https://use.typekit.net/csn6djz.css"></link>
                </Helmet>
                <div className="row">
                    <div className="col side"></div>
                    <div className="col main">
                        <h1 className="name_header">Steve Oney</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col side"></div>
                    <div className="col main">
                        <div className="row">
                            <div className="col affiliation">
                                <div className="affiliation-department">School of Information</div>
                                <div className="affiliation-university">University of Michigan</div>
                                <div className="affiliation-office">4381 North Quadrangle</div>
                                <div className="affiliation-street">105 South State Street</div>
                                <div className="affiliation-city">Ann Arbor, MI 48109</div>
                            </div>
                            <div className="col contact">
                                <div className="contact-spacer"></div>
                                <div className="contact-spacer"></div>
                                <div className="contact-homepage"><a href="http://from.so/">http://from.so/</a></div>
                                <div className="contact-phone"><a href="tel:17349990246">1 (734) 999–0246</a></div>
                                <div className="contact-email"><a href="mailto:soney@umich.edu">soney@umich.edu</a></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section education">
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-header">
                            <h2>Education</h2>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side col-2">
                            <div className="date-range">09/2008 &ndash; 04/2015</div>
                            <div className="location">Pittsburgh, PA</div>
                        </div>
                        <div className="col main col-8">
                            <div className="education-school">Carnegie Mellon University</div>
                            <table className="education-degrees">
                                <tbody>
                                    <tr> <td>PhD&nbsp;</td><td>in Human-Computer Interaction</td> </tr>
                                    <tr> <td>MS&nbsp;</td><td>in Human-Computer Interaction</td> </tr>
                                </tbody>
                            </table>
                            <table className="education-advisors">
                                <tbody>
                                    <tr> <td>Advisors:&nbsp;</td><td>Brad Myers and Joel Brandt</td> </tr>
                                    <tr> <td>Committee:&nbsp;</td><td>Scott Hudson and John Zimmerman</td> </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">09/2003 &ndash; 08/2008</div>
                            <div className="location">Cambridge, MA</div>
                        </div>
                        <div className="col main">
                            <div className="education-school">Massachusetts Institute of Technology</div>
                            <div className="education-degree">MEng in Computer Science (thesis T.1 below)</div>
                            <div className="education-degree">SB in Computer Science</div>
                            <div className="education-degree">SB in Mathematics</div>
                        </div>
                    </div>
                </div>
                <div className="section experience">
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-header">
                            <h2>Professional Experience</h2>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">09/2016 &ndash; present</div>
                            <div className="location">Ann Arbor, MI</div>
                        </div>
                        <div className="col main">
                            <div className="experience-organization">School of Information, University of Michigan</div>
                            <div className="experience-description">Assistant Professor</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">01/2017 &ndash; present</div>
                            <div className="location">Ann Arbor, MI</div>
                        </div>
                        <div className="col main">
                            <div className="experience-organization">Computer Science and Engineering, University of Michigan</div>
                            <div className="experience-description">Assistant Professor (by courtesy)</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">09/2015 &ndash; 09/2016</div>
                            <div className="location">Ann Arbor, MI</div>
                        </div>
                        <div className="col main">
                            <div className="experience-organization">School of Information, University of Michigan</div>
                            <div className="experience-description">Presidents Post-Doctoral Fellow</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">09/2008 &ndash; 04/2015</div>
                            <div className="location">Pittsburgh, PA</div>
                        </div>
                        <div className="col main">
                            <div className="experience-organization">Carnegie Mellon University (Human-Computer Interaction Institute)</div>
                            <div className="experience-description">Graduate student and researcher</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">03/2013 &ndash; 06/2013</div>
                            <div className="location">San Francisco, CA</div>
                        </div>
                        <div className="col main">
                            <div className="experience-organization">Advanced Technologies Labs, Adobe Systems, Research Intern</div>
                            <div className="experience-description">Research Intern</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">06/2011 &ndash; 09/2011</div>
                            <div className="location">San Francisco, CA</div>
                        </div>
                        <div className="col main">
                            <div className="experience-organization">Advanced Technologies Labs, Adobe Systems</div>
                            <div className="experience-description">Research Intern</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">05/2009 &ndash; 08/2009</div>
                            <div className="location">San Jose, CA</div>
                        </div>
                        <div className="col main">
                            <div className="experience-organization">IBM Research, Alamaden, Research Intern</div>
                            <div className="experience-description">Research Intern</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">01/2007 &ndash; 08/2008</div>
                            <div className="location">Cambridge, MA</div>
                        </div>
                        <div className="col main">
                            <div className="experience-organization">MIT Media Lab, Cognitive Machines Group</div>
                            <div className="experience-description">Researcher (M.Eng)</div>
                        </div>
                    </div>
                </div>
                <div className="section grants">
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-header">
                            <h2>Grants</h2>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">07/2019</div>
                            <div className="award-amount">$10,875</div>
                        </div>
                        <div className="col main">
                            <div className="award-title">Applying Literate Programming Approaches to Support Semantic Annotation</div>
                            <div className="award-team">Andrea Thomer and Steve Oney</div>
                            <div className="award-sponsor">The U-M Office of Research (UMOR)</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">10/2019</div>
                            <div className="award-amount">$598,926</div>
                        </div>
                        <div className="col main">
                            <div className="award-title">Scalable Remote Peer Help for Programming Education</div>
                            <div className="award-team">Steve Oney, Paul Resnick, and Christopher Brooks</div>
                            <div className="award-sponsor">National Science Foundation (NSF)</div>
                            <div className="award-program">Improving Undergraduate STEM Education: Education and Human Resources (IUSE: EHR)</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">01/2018</div>
                            <div className="award-amount">$174,981</div>
                        </div>
                        <div className="col main">
                            <div className="award-title">Designing Scalable Help Tools for Programming Courses</div>
                            <div className="award-team">Steve Oney</div>
                            <div className="award-sponsor">National Science Foundation (NSF)</div>
                            <div className="award-program">Cyber-Human Systems (CHS) CRII</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">11/2017</div>
                            <div className="award-amount">$37,000</div>
                        </div>
                        <div className="col main">
                            <div className="award-title">Prototyping Tools to Improve Crowd Based Training for IVA Development</div>
                            <div className="award-team">Steve Oney and Walter Lasecki</div>
                            <div className="award-sponsor">Clinc, Inc.</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">04/2017</div>
                            <div className="award-amount">$198,327</div>
                        </div>
                        <div className="col main">
                            <div className="award-title">End-User Techniques for Aggregating and Analyzing Exercise and Physical Data</div>
                            <div className="award-team">Steve Oney, Michael Nebeling, and Sun Young Park</div>
                            <div className="award-sponsor">Michigan Exercise Science &amp; Sports Initiative</div>
                        </div>
                    </div>
                </div>
                <div className="section awards">
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-header">
                            <h2>Awards</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-header">
                            <i>Note: Does not include best paper awards or nominations (in Publications above)</i>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">09/2015</div>
                        </div>
                        <div className="col main">
                            <div className="award-title">University of Michigan President's Postdoctoral Fellowship</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">10/2009</div>
                        </div>
                        <div className="col main">
                            <div className="award-title">UIST Student Innovation Contest, 1st place</div>
                            <div className="award-description">Part of winning team in most creative category</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">09/2009</div>
                        </div>
                        <div className="col main">
                            <div className="award-title">Google/UNCF Scholarship</div>
                            <div className="award-description">One-year scholarship for $10,000</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">09/2009 &ndash; 05/2012</div>
                        </div>
                        <div className="col main">
                            <div className="award-title">Ford Foundation Predoctoral Fellowship</div>
                            <div className="award-description">Annual stipend of $20,000 for three years, awarded to 60 doctoral students nationwide across disciplines</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">09/2008 &ndash; 05/2011</div>
                        </div>
                        <div className="col main">
                            <div className="award-title">ARCS Foundation Scholarship (Pittsburgh Chapter)</div>
                            <div className="award-description">Annual stipend of $5,000 for three years. Awarded to 13 doctoral students in the Pittsburgh area (CMU &amp; University of Pittsburgh)</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">09/2008</div>
                        </div>
                        <div className="col main">
                            <div className="award-title">MIT Batttlecode Open Programming Competition Finalist</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">09/2008</div>
                        </div>
                        <div className="col main">
                            <div className="award-title">NEWMAC Academic All-Conference</div>
                            <div className="award-description">Awarded for academic success while a member of MIT's varsity track team</div>
                        </div>
                    </div>
                </div>
                <div className="section presentations">
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-header">
                            <h2>Invited Presentations</h2>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">11/2019</div>
                            <div className="location">Bloomington, IN</div>
                        </div>
                        <div className="col main">
                            <div className="talk-location">Indiana University</div>
                            <div className="talk-title">Designing Tools for Remote Communication and Collaboration</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">11/2018</div>
                            <div className="location">Williamstown, MA</div>
                        </div>
                        <div className="col main">
                            <div className="talk-location">Williams College</div>
                            <div className="talk-title">CS Colloquium&mdash;Designing Tools for More Effective Remote Communication</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">11/2017</div>
                            <div className="location">Madison, WI</div>
                        </div>
                        <div className="col main">
                            <div className="talk-location">University of Wisconsin</div>
                            <div className="talk-title">HCI Seminar: Designing Tools for Remote Communication Between Programmers</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">03/2016</div>
                            <div className="location">Ann Arbor, MI</div>
                        </div>
                        <div className="col main">
                            <div className="talk-location">University of Michigan School of Information</div>
                            <div className="talk-title">Programming Tools that Speak our Language</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">10/2015</div>
                            <div className="location">South Bend, IN</div>
                        </div>
                        <div className="col main">
                            <div className="talk-location">University of Notre Dame Department of Computer Science and Engineering</div>
                            <div className="talk-title">Expressing Interactivity with States and Constraints</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">04/2015</div>
                            <div className="location">Chicago, IL</div>
                        </div>
                        <div className="col main">
                            <div className="talk-location">University of Illinois at Chicago Department of Computer Science</div>
                            <div className="talk-title">Expressing Interactivity with States and Constraints</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">03/2015</div>
                            <div className="location">Boston, MA</div>
                        </div>
                        <div className="col main">
                            <div className="talk-location">Boston University Department of Computer Science</div>
                            <div className="talk-title">Expressing Interactivity with States and Constraints</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">03/2015</div>
                            <div className="location">Palo Alto, CA</div>
                        </div>
                        <div className="col main">
                            <div className="talk-location">FX Palo Alto Laboratory</div>
                            <div className="talk-title">Expressing Interactivity with States and Constraints</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">03/2015</div>
                            <div className="location">Stony Brook, CA</div>
                        </div>
                        <div className="col main">
                            <div className="talk-location">Stony Brook Computer Science Department</div>
                            <div className="talk-title">Expressing Interactivity with States and Constraints</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">02/2015</div>
                            <div className="location">Irvine, CA</div>
                        </div>
                        <div className="col main">
                            <div className="talk-location">University of California at Irvine</div>
                            <div className="talk-title">Expressing Interactivity with States and Constraints</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">03/2010</div>
                            <div className="location">Dagstuhl, Germany</div>
                        </div>
                        <div className="col main">
                            <div className="talk-location">Dagstuhl: Practical Software Testing: Tool Automation and Human Factors</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">06/2009</div>
                            <div className="location">San Jose, CA</div>
                        </div>
                        <div className="col main">
                            <div className="talk-location">IBM Almaden Lunch Seminar</div>
                            <div className="talk-title">FireCrystal: Understanding Interactive Behaviors in Dynamic Web Pages</div>
                        </div>
                    </div>
                </div>
                <div className="section service">
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-header">
                            <h2>Service</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-subheader">
                            <h3>Program Committee</h3>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2019</div>
                        </div>
                        <div className="col main">
                            <div className="venue">International Workshop on Eye Movements in Programming (EMIP)</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2019</div>
                        </div>
                        <div className="col main">
                            <div className="venue">ACM Conference on Tangible, Embedded, and Embodied Interactions (TEI)</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2019</div>
                        </div>
                        <div className="col main">
                            <div className="venue">Tech Notes for the ACM SIGCHI Symposium on Engineering Interactive Computing Systems (EICS)</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2017, 2018, 2020</div>
                        </div>
                        <div className="col main">
                            <div className="venue">ACM Symposium on User Interface Software and Technology (UIST)</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2018, 2020</div>
                        </div>
                        <div className="col main">
                            <div className="venue">ACM International Conference on Supporting Group Work (GROUP)</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">2017--2020</div>
                        </div>
                        <div className="col main">
                            <div className="venue">Programming Experience Workshop (PX)</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">2016--2020</div>
                        </div>
                        <div className="col main">
                            <div className="venue">ACM Conference on Human Factors in Computing Systems (CHI)</div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-subheader">
                            <h3>Peer Reviewing</h3>
                        </div>
                    </div>

                    <div className="row item">
                        <div className="col side">
                            <div className="date">2018</div>
                        </div>
                        <div className="col main">
                            <div className="venue">IEEE Transactions of Software Engineering (TSE)</div>
                        </div>
                    </div>
                </div>
            </div>
    }
}