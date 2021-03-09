import * as React from 'react'
import { Helmet } from 'react-helmet';
import './cv.scss'
import { StrapiPublicationGroupConnection } from '../../graphql-types';
import { graphql } from 'gatsby';
import { getDownloadName } from '../components/publications';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const cvQuery = graphql`query cvPublications {
    allStrapiPublication(filter: {status: {in: ["accepted"]}}) {
        nodes {
            id
            title
            award
            award_description
            pub_details
            short_description
            status
            authors {
                id
                given_name
                family_name
                homepage
                membership
            }
            student_authors {
                id
            }
            venue {
                id
                location
                year
                homepage
                conference_start
                conference_end
                full_name
                short_name
                type
            }
            pdf {
                publicURL
            }
        }
    }
}`;
interface CVPageProps {
    data: {
        allStrapiPublication: StrapiPublicationGroupConnection,
    },
    location: {
        search?: string
    }
}
interface CVPageState {
    includePaperAwards: boolean;
    underlineStudentAuthors: boolean;
    showAllUndergraduateCollaborators: boolean;
}
enum PUB_TYPES {
    CONFERENCE='C',
    JOURNAL='J',
    BOOK_CHAPTER='B',
    WORKSHOP='W',
    POSTER='P',
    DOCTORAL_CONSORTIUM='D',
    THESIS='T'
};

function convertPubType(typeString: string): PUB_TYPES|null {
    if(typeString === 'conference') {
        return PUB_TYPES.CONFERENCE;
    } else if(typeString === 'journal') {
        return PUB_TYPES.JOURNAL;
    } else if(typeString === 'thesis') {
        return PUB_TYPES.THESIS;
    } else if(typeString === 'bookchapter') {
        return PUB_TYPES.BOOK_CHAPTER;
    } else if(typeString === 'poster') {
        return PUB_TYPES.POSTER;
    } else if(typeString === 'workshop') {
        return PUB_TYPES.WORKSHOP;
    } else if(typeString === 'doctoralconsortium') {
        return PUB_TYPES.DOCTORAL_CONSORTIUM;
    } else {
        return null;
    }
}



export default class extends React.Component<CVPageProps, CVPageState> {
    constructor(props: CVPageProps) {
        super(props);
        this.state = {
            includePaperAwards: false,
            underlineStudentAuthors: false,
            showAllUndergraduateCollaborators: false
        }
    }
    private getPubElements(types: PUB_TYPES[]): JSX.Element[] {
        const filteredRows = this.props.data.allStrapiPublication.nodes.filter((pub) => {
            if(!pub.authors.some((a) => a.given_name === 'Steve' && a.family_name === 'Oney')) {
                return false;
            }
            const venue = pub.venue;
            if(venue) {
                const venueType = venue.type;
                if(venueType) {
                    return types.indexOf(convertPubType(venueType)) >= 0;
                }
            }
            return false;
        });
        filteredRows.sort((a, b) => {
            const ayear = a.venue.year;
            const byear = b.venue.year;

            const [amonth, aday] = a.venue.conference_start ? a.venue.conference_start.split('/').map((x) => parseInt(x)) : [0, 0];
            const [bmonth, bday] = b.venue.conference_start ? b.venue.conference_start.split('/').map((x) => parseInt(x)) : [0, 0];
            return (byear*365+bmonth*31+bday) - (ayear*365+amonth*31+aday);
        });
        let count = filteredRows.length;
        let footNoteCount: number = 1;
        const rows = filteredRows.map((pub) => {
            const studentAuthorIDs = pub.student_authors.map((sa) => sa.id);
            const authorNames = pub.authors.map((author) => {
                const fullName = `${author.given_name} ${author.family_name}`;
                const isMe = fullName === 'Steve Oney';
                const isStudent = studentAuthorIDs.indexOf(author.id) >= 0;
                const classNames = [' author ', isMe?' me ':null, isStudent?' student ':null].join(' ');
                return <span className={classNames} key={author.id}>{fullName}</span>
            });
            const { award, award_description } = pub;

            let shortAuthors: (string|JSX.Element)[] = [];
            if(authorNames.length === 1) {
                shortAuthors = [authorNames[0]];
            } else if(authorNames.length === 2) {
                shortAuthors = [authorNames[0], ' and ', authorNames[1]];
            } else if(authorNames.length > 2) {
                authorNames.slice(0, authorNames.length-2).forEach((an) => {
                    shortAuthors.push(an);
                    shortAuthors.push(', ');
                });
                shortAuthors.push(authorNames[authorNames.length - 2]);
                shortAuthors.push(', and ');
                shortAuthors.push(authorNames[authorNames.length - 1]);
            }
            const convertedPubtype = convertPubType(pub.venue.type);
            const [startMonth, startDay] = pub.venue.conference_start ? pub.venue.conference_start.split('/').map((x) => parseInt(x)) : [-1, -1];
            const [endMonth, endDay] = pub.venue.conference_end ? pub.venue.conference_end.split('/').map((x) => parseInt(x)) : [-1, -1];
            const startMonthName = MONTHS[startMonth-1];

            let dateRangeString: string = '';
            
            if(startMonth > 0) {
                dateRangeString = `${startMonthName} ${startDay}`;

                if(endMonth > 0) {
                    dateRangeString += ' – ';

                    if(startMonth !== endMonth) {
                        const endMonthName = MONTHS[endMonth-1];
                        dateRangeString += endMonthName + ' ';
                    }
                    dateRangeString += endDay;
                }
                dateRangeString += '. '
            }

            const downloadName = getDownloadName(pub);
            const pdfDisplay = pub.pdf ? <a className="pdf-download" href={pub.pdf.publicURL} download={downloadName}>(PDF)</a> : null;

            let awardFootnote: string = ''; 
            if(award_description) {
                for(let i: number = 0; i<footNoteCount; i++) {
                    awardFootnote += '*'
                }
                // footNoteCount++;
            }

            let venueString = `${pub.venue.full_name}`;
            if(pub.venue.short_name) {
                venueString += ` (${pub.venue.short_name})`;
            }

            const locationString = pub.venue.location ? `${pub.venue.location}. ` : '';

            const row = <div className="paper row" key={pub.id}>
                <div className="col side">
                    <span className='paper-award-label'>
                        {award=='honorable_mention' && <i className="icon-honorable_mention"></i> }
                        {award=='best_paper' && <i className="icon-best_paper"></i> }
                        {awardFootnote && <span>{awardFootnote}</span>}
                        {award && ' ' }
                    </span>
                    <span className="paper-id">{convertedPubtype}.{count}</span>
                    <div className='pdf-download'>{pdfDisplay}</div>
                </div>
                <div className="col main">
                    {shortAuthors}. ({pub.venue.year}) {pub.title}. <i>{venueString}</i>. {locationString} {pub.pub_details}
                    {awardFootnote && <div className="paper-award-footnote row"><div className="col">{awardFootnote}{award_description}</div></div> }
                </div>
            </div>;
            count--;
            return row;
        })
        return rows;
    }
    public render() {
        const { includePaperAwards, underlineStudentAuthors, showAllUndergraduateCollaborators } = this.state;
        const hsaChange = (event) => {
            this.setState({underlineStudentAuthors: event.target.checked});
        };
        const ipaChange = (event) => {
            this.setState({includePaperAwards: event.target.checked});
        };
        const iuChange = (event) => {
            this.setState({showAllUndergraduateCollaborators: event.target.checked});
        };
        // const highlightStudents = this.props.location.search.indexOf('highlight_students') >= 0;
        // const verboseMode = this.props.location.search.indexOf('verbose_mode') >= 0;
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
                                    <tr><td>PhD&nbsp;</td><td>in Human-Computer Interaction</td></tr>
                                    <tr><td>MS&nbsp;</td><td>in Human-Computer Interaction</td></tr>
                                </tbody>
                            </table>
                            <table className="education-advisors">
                                <tbody>
                                    <tr><td>Advisors:&nbsp;</td><td>Brad Myers and Joel Brandt</td></tr>
                                    <tr><td>Committee:&nbsp;</td><td>Scott Hudson and John Zimmerman</td></tr>
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
                            <div className="education-degree">MEng in Computer Science</div>
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
                <div className={"section publications" + (underlineStudentAuthors ? ' highlight-students' : '')}>
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-header">
                            <h2>Publications</h2>
                        </div>
                    </div>
                    <div className="row d-print-none">
                        <div className="col side"></div>
                        <div className="col main">
                            <input id="hsacheckbox" type="checkbox" checked={this.state.underlineStudentAuthors} onChange={hsaChange} />&nbsp;<label htmlFor="hsacheckbox">Highlight Student Authors</label>
                        </div>
                    </div>
                    <div className="row highlight-students-note">
                        <div className="col side"></div>
                        <div className="col main">
                            <p>Note: The names of authors who were students at the time of publication are <span className='student'>underlined</span> (including my name if I was a student at the time of publication).</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main">
                        <strong>Labels:</strong>
                        &nbsp;
                        <i className="icon-best_paper"></i>: best paper award
                        &nbsp; &nbsp;
                        <i className="icon-honorable_mention"></i>: honorable mention
                        </div>
                    </div>
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main">
                        <strong>Approximate Acceptance Rates:</strong>
                        &nbsp;
                        UIST: 22%, CHI: 23%, VL/HCC: 30%, CSCW: 25%, ICSE: 19%, IMX: 26%
                        </div>
                    </div>
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-subheader">
                            <h3>Heavily-reviewed Journal Manuscripts ({PUB_TYPES.JOURNAL})</h3>
                        </div>
                    </div>
                    {this.getPubElements([PUB_TYPES.JOURNAL])}
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-subheader">
                            <h3>Heavily-reviewed Conference Papers ({PUB_TYPES.CONFERENCE})</h3>
                        </div>
                    </div>
                    {this.getPubElements([PUB_TYPES.CONFERENCE])}
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-subheader">
                            <h3>Book Chapters ({PUB_TYPES.BOOK_CHAPTER})</h3>
                        </div>
                    </div>
                    {this.getPubElements([PUB_TYPES.BOOK_CHAPTER])}
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-subheader">
                            <h3>Refereed Posters ({PUB_TYPES.POSTER}), Workshops ({PUB_TYPES.WORKSHOP}), and Doctoral Consortiums ({PUB_TYPES.DOCTORAL_CONSORTIUM})</h3>
                        </div>
                    </div>
                    {this.getPubElements([PUB_TYPES.POSTER, PUB_TYPES.WORKSHOP, PUB_TYPES.DOCTORAL_CONSORTIUM])}
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-subheader">
                            <h3>Theses ({PUB_TYPES.THESIS})</h3>
                        </div>
                    </div>
                    {this.getPubElements([PUB_TYPES.THESIS])}
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
                            <div className="date">11/2020</div>
                            <div className="award-amount">$10,000</div>
                        </div>
                        <div className="col main">
                            <div className="award-team"><strong>Steve Oney (PI)</strong></div>
                            <div className="award-sponsor">Adobe, Inc.</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">10/2020</div>
                            <div className="award-amount">$60,000</div>
                        </div>
                        <div className="col main">
                            <div className="award-title">Designing and Building Collaborative Tools for Mixed-Ability Programming Teams</div>
                            <div className="award-team"><strong>Steve Oney (PI)</strong> (and Mauli Pandey, unofficially)</div>
                            <div className="award-sponsor">Google Inc.</div>
                            <div className="award-program">Award for Inclusion Research Award</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">09/2020</div>
                            <div className="award-amount">$499,209</div>
                        </div>
                        <div className="col main">
                            <div className="award-title">Improving Web Accessibility Through Multi-Resolution Mixed-Initiative Interaction Tools</div>
                            <div className="award-team"><strong>Steve Oney (PI)</strong> and Walter Lasecki</div>
                            <div className="award-sponsor">National Science Foundation (NSF)</div>
                            <div className="award-program">IIS: Cyber-Human Systems (CHS)</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">07/2019</div>
                            <div className="award-amount">$10,875</div>
                        </div>
                        <div className="col main">
                            <div className="award-title">Applying Literate Programming Approaches to Support Semantic Annotation</div>
                            <div className="award-team">Andrea Thomer (PI) and <strong>Steve Oney (co-PI)</strong></div>
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
                            <div className="award-team"><strong>Steve Oney (PI)</strong>, Paul Resnick, and Christopher Brooks</div>
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
                            <div className="award-team"><strong>Steve Oney (PI)</strong></div>
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
                            <div className="award-team"><strong>Steve Oney (PI)</strong> and Walter Lasecki</div>
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
                            <div className="award-team"><strong>Steve Oney (PI)</strong>, Michael Nebeling, and Sun Young Park</div>
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
                    <div className="row d-print-none">
                        <div className="col side"></div>
                        <div className="col main">
                            <input id="ipacheckbox" type="checkbox" checked={this.state.includePaperAwards} onChange={ipaChange} />&nbsp;<label htmlFor="ipacheckbox">Include Best Paper Awards</label>
                        </div>
                    </div>
                    {!includePaperAwards &&
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-header">
                            <i>Note: Does not include best paper awards or nominations (in Publications above)</i>
                        </div>
                    </div>
                    }
                    {includePaperAwards &&
                    <div className="row item">
                        <div className="col side">
                            <div className="date">08/2020</div>
                        </div>
                        <div className="col main">
                            <div className="award-title">IEEE VL/HCC: Best Short Paper</div>
                            <i>EdCode: Towards Personalized Support at Scale for Remote Assistance in CS Education</i>
                        </div>
                    </div>
                    }
                    {includePaperAwards &&
                    <div className="row item">
                        <div className="col side">
                            <div className="date">08/2020</div>
                        </div>
                        <div className="col main">
                            <div className="award-title">CHI 2020: Honorable Mention for Best Paper</div>
                            <i>Callisto: Capturing the "Why" by Connecting Conversations with Computational Narratives</i>
                        </div>
                    </div>
                    }
                    {includePaperAwards &&
                    <div className="row item">
                        <div className="col side">
                            <div className="date">11/2019</div>
                        </div>
                        <div className="col main">
                            <div className="award-title">CSCW 2019: Best Paper</div>
                            <i>How Data Scientists Use Computational Notebooks for Real-Time Collaboration</i>
                        </div>
                    </div>
                    }
                    {includePaperAwards &&
                    <div className="row item">
                        <div className="col side">
                            <div className="date">10/2019</div>
                        </div>
                        <div className="col main">
                            <div className="award-title">IEEE VL/HCC: Best Short Paper</div>
                            <i>Studying the Benefits and Challenges of Immersive Dataflow Programming</i>
                        </div>
                    </div>
                    }
                    {includePaperAwards &&
                    <div className="row item">
                        <div className="col side">
                            <div className="date">05/2019</div>
                        </div>
                        <div className="col main">
                            <div className="award-title">ACM CHI 2019: Honorable Mention for Best Paper</div>
                            <i>Implementing Multi-Touch Gestures with Touch Groups and Cross Events</i>
                        </div>
                    </div>
                    }
                    {includePaperAwards &&
                    <div className="row item">
                        <div className="col side">
                            <div className="date">10/2018</div>
                        </div>
                        <div className="col main">
                            <div className="award-title">ACM UIST 2018: Honorable Mention for Best Paper</div>
                            <i>Adasa: A Conversational In-Vehicle Digital Assistant for Advanced Driver Assistance Features</i>
                        </div>
                    </div>
                    }
                    <div className="row item">
                        <div className="col side">
                            <div className="date">09/2015</div>
                        </div>
                        <div className="col main">
                            <div className="award-title">University of Michigan President's Postdoctoral Fellowship</div>
                        </div>
                    </div>
                    {includePaperAwards &&
                    <div className="row item">
                        <div className="col side">
                            <div className="date">04/2013</div>
                        </div>
                        <div className="col main">
                            <div className="award-title">ACM CHI 2013: Honorable Mention for Best Paper</div>
                            <i>Adasa: A Conversational In-Vehicle Digital Assistant for Advanced Driver Assistance Features</i>
                        </div>
                    </div>
                    }
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
                            <div className="date">12/2020</div>
                            <div className="location">Seattle, WA<br/>(remote)</div>
                        </div>
                        <div className="col main">
                            <div className="talk-location">University of Washington DUB Seminar</div>
                            <div className="talk-title">Designing Tools for Remote Communication in Programming</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">10/2020</div>
                            <div className="location">Cambridge, MA<br/>(remote)</div>
                        </div>
                        <div className="col main">
                            <div className="talk-location">MIT CSAIL HCI Seminar</div>
                            <div className="talk-title">Designing Tools for Remote Communication in Programming</div>
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
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2021</div>
                        </div>
                        <div className="col main">
                            <div className="role">Program Co-Chair (with Jácome Miguel Costa Cunha)</div>
                            <div className="venue">IEEE Symposium on Visual Languages and Human-Centric Computing (VL/HCC)</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-subheader">
                            <h3>Organizing Committee</h3>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2020</div>
                        </div>
                        <div className="col main">
                            <div className="role">Graduate Consortium co-chair (with Michael Lee)</div>
                            <div className="venue">IEEE Symposium on Visual Languages and Human-Centric Computing (VL/HCC)</div>
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
                            <div className="date-range">2017 &ndash; 2020</div>
                        </div>
                        <div className="col main">
                            <div className="venue">Programming Experience Workshop (PX)</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">2016 &ndash; 2020</div>
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
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2018</div>
                        </div>
                        <div className="col main">
                            <div className="venue">ACM Transactions on Computer-Human Interaction (TOCHI)</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2010 &ndash; 2016</div>
                        </div>
                        <div className="col main">
                            <div className="venue">ACM Conference on Human Factors in Computing Systems (CHI)</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2011 &ndash; 2015</div>
                        </div>
                        <div className="col main">
                            <div className="venue">ACM Symposium on User Interface Software &amp; Technology (UIST)</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2014</div>
                        </div>
                        <div className="col main">
                            <div className="venue">Conference on Human-Computer Interaction with Mobile Devices (MobileHCI)</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2010, 2012</div>
                        </div>
                        <div className="col main">
                            <div className="venue">ACM Conference on Designing Interactive Systems (DIS)</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2008, 2009</div>
                        </div>
                        <div className="col main">
                            <div className="venue">Philippine Journal of Science (PJS)</div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-subheader">
                            <h3>Operations Committee</h3>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">2012 &ndash; 2015</div>
                        </div>
                        <div className="col main">
                            <div className="venue">ACM CHI Operations Committee (mobile program guide)</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">2013 &ndash; 2015</div>
                        </div>
                        <div className="col main">
                            <div className="venue">ACM UIST Operations Committee (mobile program guide)</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">2013 &ndash; 2015</div>
                        </div>
                        <div className="col main">
                            <div className="venue">ACM ITS Operations Committee (mobile program guide)</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2012</div>
                        </div>
                        <div className="col main">
                            <div className="venue">ACM UbiComp Committee (mobile program guide)</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2010, 2011</div>
                        </div>
                        <div className="col main">
                            <div className="venue">ACM CHI student volunteer (mobile guide development team)</div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-subheader">
                            <h3>UMSI</h3>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2019 &ndash; 2020</div>
                        </div>
                        <div className="col main">
                            <div className="venue">School of Information Technical Curriculum Task Force</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2018 &ndash; 2020</div>
                        </div>
                        <div className="col main">
                            <div className="venue">School of Information BSI Committee</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2018 &ndash; 2019</div>
                        </div>
                        <div className="col main">
                            <div className="venue">University of Michigan Interactive and Social Computing (MISC) Coordinator</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-subheader">
                            <h3>Other</h3>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2009 &ndash; 2015</div>
                        </div>
                        <div className="col main">
                            <div className="venue">CMU Computer Science outreach roadshow volunteer (with Women@SCS &amp; SCS4All)</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2011 &ndash; 2014</div>
                        </div>
                        <div className="col main">
                            <div className="venue">CMU Human-Computer Interaction Institute (HCII) ombudsman</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2010</div>
                        </div>
                        <div className="col main">
                            <div className="venue">CMU Human-Computer Interaction Institute (HCII) visit weekend co-chair</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2009, 2010</div>
                        </div>
                        <div className="col main">
                            <div className="venue">CMU Human-Computer Interaction Institute (HCII) PhD lunch coordinator</div>
                        </div>
                    </div>
                </div>
                <div className="section teaching">
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-header">
                            <h2>Teaching</h2>
                        </div>
                    </div>

                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">2021 &ndash; present</div>
                            <div className="location">University of Michigan</div>
                        </div>
                        <div className="col main">
                            <div className="course-name">Instructor (and creator) &ndash; SI 579 (Building Interactive Applications)</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">2016 &ndash; present</div>
                            <div className="location">University of Michigan</div>
                        </div>
                        <div className="col main">
                            <div className="course-name">Instructor &ndash; SI 106 (Programs, Information, &amp; People)</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2009</div>
                            <div className="location">University of Michigan &amp; Coursera</div>
                        </div>
                        <div className="col main">
                            <div className="course-name">Python 3 Programming Specialization</div>
                            <div className="course-url"><a href="https://www.coursera.org/specializations/python-3-programming">https://www.coursera.org/specializations/python-3-programming</a></div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="semester">Fall 2012</div>
                            <div className="location">Carnegie Mellon</div>
                        </div>
                        <div className="col main">
                            <div className="course-name">Instructor &ndash; Web Lab, Programming User Interfaces</div>
                            <div className="course-description">Developed syllabus, wrote lectures, created projects, presented, graded, and held office hours weekly. Instructor rating: 4.7/5.0</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="semester">Fall 2010</div>
                            <div className="location">Carnegie Mellon</div>
                        </div>
                        <div className="col main">
                            <div className="course-name">Instructor &ndash; GUI Lab, Programming User Interfaces</div>
                            <div className="course-description">Developed syllabus, wrote lectures, created projects, presented, graded, and held office hours weekly. Instructor rating: 4.6/5.0</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="semester">Fall 2007 &amp; Spring 2008</div>
                            <div className="location">MIT</div>
                        </div>
                        <div className="col main">
                            <div className="course-name">Instructor &ndash; GUI Lab, Programming User Interfaces</div>
                            <div className="course-description">Taught three recitation sections per week, held weekly office hours, and graded students’ exams</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="semester">Summer 2007</div>
                            <div className="location">MIT</div>
                        </div>
                        <div className="col main">
                            <div className="course-name">Teaching Assistant &ndash; Interphase Physics I</div>
                            <div className="course-description">Taught three classes per week, held weekly office hours, and mentored a group of incoming MIT freshmen</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="semester">Spring 2005</div>
                            <div className="location">MIT</div>
                        </div>
                        <div className="col main">
                            <div className="course-name">Teaching Assistant &ndash; Technology Enabled Learning (TEAL) Physics II</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">Spring 2005 &ndash; Fall 2006</div>
                            <div className="location">MIT</div>
                        </div>
                        <div className="col main">
                            <div className="course-name">Laboratory Assistant &ndash; Circuits and Electronics</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="semester">Fall 2006</div>
                            <div className="location">MIT</div>
                        </div>
                        <div className="col main">
                            <div className="course-name">Laboratory Assistant &ndash; Computational Structures</div>
                        </div>
                    </div>
                </div>
                <div className="section supervisees">
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-header">
                            <h2>Students Supervised</h2>
                        </div>
                    </div>
                    <div className="row d-print-none">
                        <div className="col side"></div>
                        <div className="col main">
                            <input id="iucheckbox" type="checkbox" checked={this.state.showAllUndergraduateCollaborators} onChange={iuChange} />&nbsp;<label htmlFor="iucheckbox">Include Undergraduate Collaborators</label>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-subheader">
                            <h3>Dissertation Chair (Ph.D. Graduates)</h3>
                        </div>
                    </div>

                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">Fall 2015 &ndash; Fall 2020</div>
                            <div className="location">University of Michigan</div>
                        </div>
                        <div className="col main">
                            <div className="supervisee">Yan Chen (School of Information)</div>
                            <div className="supervisee-thesis">Thesis: On-Demand Collaboration in Programming</div>
                            <div className="supervisee-position">Currently: Postdoctoral Researcher at the University of Toronto (with Tovi Grossman)</div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-subheader">
                            <h3>Ph.D. Advisees (Ongoing)</h3>
                        </div>
                    </div>

                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">Fall 2018 &ndash; present</div>
                            <div className="location">University of Michigan</div>
                        </div>
                        <div className="col main">
                            <div className="supervisee">Lei Zhang (School of Information)</div>
                            <div className="supervisee-thesis"></div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">Fall 2018 &ndash; present</div>
                            <div className="location">University of Michigan</div>
                        </div>
                        <div className="col main">
                            <div className="supervisee">(Mauli) Maulishree Pandey (School of Information)</div>
                            <div className="supervisee-thesis"></div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">Fall 2018 &ndash; present</div>
                            <div className="location">University of Michigan</div>
                        </div>
                        <div className="col main">
                            <div className="supervisee">(April) Yi Wang (School of Information)</div>
                            <div className="supervisee-thesis">(co-advised with Christopher Brooks)</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date-range">Fall 2017 &ndash; present</div>
                            <div className="location">University of Michigan</div>
                        </div>
                        <div className="col main">
                            <div className="supervisee">Rebecca Krosnick (Computer Science and Engineering)</div>
                            <div className="supervisee-thesis"></div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-subheader">
                            <h3>Thesis Committees (Ph.D.)</h3>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2020</div>
                            <div className="location">University of Michigan</div>
                        </div>
                        <div className="col main">
                            <div className="student">Vaspol Ruamviboonsuk (Computer Science and Engineering)</div>
                            <div className="student-thesis">Understanding and Improving the Performance of Web Page Loads</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2019</div>
                            <div className="location">University of Michigan</div>
                        </div>
                        <div className="col main">
                            <div className="student">Shih-Chieh Lin (Computer Science and Engineering)</div>
                            <div className="student-thesis">Cross-Layer System Design for Autonomous Driving</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2017</div>
                            <div className="location">University of Michigan</div>
                        </div>
                        <div className="col main">
                            <div className="student">Sang Won Lee (Computer Science and Engineering)</div>
                            <div className="student-thesis">Improving User Involvement Through Live, Collaborative Creation</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2017</div>
                            <div className="location">University of Michigan</div>
                        </div>
                        <div className="col main">
                            <div className="student">Xin Rong (School of Information)</div>
                            <div className="student-thesis">Neural Language Models for Data-Driven Programming Support</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-subheader">
                            <h3>Thesis Committees (M.S.)</h3>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2020</div>
                            <div className="location">University of Michigan</div>
                        </div>
                        <div className="col main">
                            <div className="student">Xunan (Andy) Zhou (School of Information)</div>
                            <div className="student-thesis">Conversational Agent Experience: What makes a good skill?</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2020</div>
                            <div className="location">University of Michigan</div>
                        </div>
                        <div className="col main">
                            <div className="student">Kangning Chen (School of Information)</div>
                            <div className="student-thesis">Providing Examples and Tool Support for Novice AR Creators</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2019</div>
                            <div className="location">University of Michigan</div>
                        </div>
                        <div className="col main">
                            <div className="student">Katy Madier (School of Information)</div>
                            <div className="student-thesis">Enabling Low-cost Co-located Virtual Reality Experiences</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="date">2018</div>
                            <div className="location">University of Michigan</div>
                        </div>
                        <div className="col main">
                            <div className="student">Maulishree Pandey (School of Information)</div>
                            <div className="student-thesis">Exploring and Designing for the Self-Tracking Needs of Recreational Athletes</div>
                        </div>
                    </div>
                    {showAllUndergraduateCollaborators &&
                    <>
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-subheader">
                            <h3>Other Mentees</h3>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                        </div>
                        <div className="col main">
                            <ul>
                                <li>Hussain Alafaireet (MSI Researcher)</li>
                                <li>Niu Chang (Undergraduate Summer Intern.)</li>
                                <li>Erin Deutschman (Explore CS Research Mentee.)</li>
                                <li>Natalie Gross (UMSI, Undergraduate Researcher)</li>
                                <li>Yunjie Guo (Michigan CSE Undergraduate Researcher)</li>
                                <li>Jaylin Herskovitz (Former Undergraduate Researcher. Now Ph.D. student at Michigan (CSE))</li>
                                <li>Ruidong Liu (Undergraduate researcher. Now Ph.D. student at Cornell University)</li>
                                <li>Gabriel Matute (Former Undergraduate Researcher. Now Ph.D. student at UC Berkeley)</li>
                                <li>Jamie Neumann (UMSI, Undergraduate Researcher)</li>
                                <li>Rebecca Parada (UMSI, Undergraduate Researcher)</li>
                                <li>Tami Van Omen (Undergraduate researcher.)</li>
                                <li>Yisen Wang (Explore CS Research Mentee.)</li>
                                <li>Ningqi Wang</li>
                                <li>Zihan Wu (Undergraduate Summer Intern. Currently: UMSI PhD Student)</li>
                                <li>Jie Wei Wu (MSI Researcher. Now: Google Software Engineer)</li>
                                <li>Jessica Wu (Former Undergraduate Researcher. Now Software Engineer at Amazon)</li>
                                <li>Yin Xie (Former MS researcher. Now interaction designer at Internet Brands)</li>
                                <li>Johnathan Yan (Undergraduate Researcher.)</li>
                                <li>YiWei Yang (Former CSE Undergraduate Researcher. Now Ph.D. student at the University of Washington)</li>
                                <li>Muhan Zhao (Michigan CSE Undergraduate Researcher)</li>
                                <li>Yuan Zhou (Undergraduate Summer Intern. Georgia Tech M.S.)</li>
                                <li>Licheng Zhu (MSI Researcher. Now: Senior User Experience Researcher at Thompson Reuters)</li>
                            </ul>
                        </div>
                    </div>
                    </>
                    }
                </div>
                <div className="section press">
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-header">
                            <h2>Press</h2>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="outlet">VentureBeat, 2014</div>
                        </div>
                        <div className="col main">
                            <div className="title"><a href="http://venturebeat.com/2014/06/23/adobe-and-cmu-researchers-unveil-a-brilliant-new-javascript-library-constraintjs/">Adobe and CMU researchers unveil a brilliant new JavaScript library: ConstraintJS</a></div>
                            <div className="date">June 23</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="outlet">Wired, 2013</div>
                        </div>
                        <div className="col main">
                            <div className="title"><a href="http://www.wired.com/gadgetlab/2013/05/zoomboard-smartwatch-typing/">Researchers Figure Out How You Can Type on a Smartwatch</a></div>
                            <div className="date">May 1</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="outlet">Slashdot, 2013</div>
                        </div>
                        <div className="col main">
                            <div className="title"><a href="http://hardware.slashdot.org/story/13/05/01/1313206/carnegie-mellon-offers-wee-qwerty-texting-tech-for-impossibly-tiny-devices">CMU Offers Wee QWERTY Texting Tech for Impossibly Tiny Devices</a></div>
                            <div className="date">May 1</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="outlet">Gizmodo, 2013</div>
                        </div>
                        <div className="col main">
                            <div className="title"><a href="http://gizmodo.com/how-typing-on-a-smart-watch-might-actually-make-sense-484116402">How Typing on a Smart Watch Might Actually Make Sense</a></div>
                            <div className="date">April 29</div>
                        </div>
                    </div>
                    <div className="row item">
                        <div className="col side">
                            <div className="outlet">MIT Tech Review, 2013</div>
                        </div>
                        <div className="col main">
                            <div className="title"><a href="http://www.technologyreview.com/news/514096/a-qwerty-keyboard-for-your-wrist/">A QWERTY Keyboard for your Wrist</a></div>
                            <div className="date">April 27</div>
                        </div>
                    </div>
                </div>
                <div className="section patents">
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-header">
                            <h2>Patent</h2>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col side">
                            <div className="date">11/2016</div>
                        </div>
                        <div className="col main">US Patent number 9,495,134. "Methods and Apparatus for Code Segment Handling" Brandt, J. &amp; Oney, S.</div>
                    </div>
                </div>
            </div>;
    }
}