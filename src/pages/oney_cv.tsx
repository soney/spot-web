import * as React from 'react'
import './cv.scss'
import { graphql } from 'gatsby';
import { getAwardText, getDownloadName } from '../components/publications';
import ReactMarkdown from 'react-markdown';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const cvQuery = graphql`query cvPublications {
    allStrapiPublication(
        filter: {submission_status: {in: ["accepted"]}}
        sort: {venue: {year: DESC}}
    ) {
        nodes {
            id
            title
            award
            award_description
            pub_details
            short_description
            submission_status
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
                name_year
                type
            }
            pdf {
                localFile {
                    publicURL
                }
            }
        }
    }
    allStrapiAuthor(filter: {membership: {in: ["ugrad_ms_student"]}}, sort: [{membership: ASC}, {family_name: ASC}]) {
        nodes {
            id
            color
            given_name
            family_name
            middle_name
            homepage
            short_bio
            long_bio
            membership
        }
    }
    strapiLeadcv {
        name
        affiliation {
            department
            university
            office
            street
            city
        }
        contact {
            homepage
            phone
            email
        }
        education {
            advisors
            committee
            date_end
            date_start
            degrees {
                strapi_json_value
                id
            }
            location
            university
            id
        }
        professional_experience {
            id
            date_start
            date_end
            institution
            location
            title
        }
        patents {
            id
            title
            date
        }
        grants {
            amount
            date
            id
            program
            sponsor
            team
            title
        }
        awards {
            date_end
            date_start
            description
            id
            title
        }
        service {
            category
            date_end
            date_start
            description
            id
            title
        }
        supervised_students {
            category
            current_position
            date_end
            date_start
            id
            coadvisor
            institution
            student_department
            student_name
            thesis_title
        }
        invited_presentations {
            id
            date
            institution
            location
            title
        }
        teaching {
            id
            description
            date_start
            date_end
            institution
            title
        }
        press {
            description
            id
            link
            publication
            title
        }
    }
}`;
interface CVPageProps {
    data: {
        allStrapiPublication: Queries.STRAPI_PUBLICATIONConnection,
        allStrapiAuthor: Queries.STRAPI_AUTHORConnection,
        strapiLeadcv: Queries.STRAPI_LEADCV
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
    DEMO='E',
    PANEL='A',
    THESIS='T',
    PREPRINT='R'
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
    } else if(typeString === 'panel') {
        return PUB_TYPES.PANEL;
    } else if(typeString === 'demo') {
        return PUB_TYPES.DEMO;
    } else if(typeString === 'preprint') {
        return PUB_TYPES.PREPRINT;
    } else {
        return null;
    }
}
export const Head = (props: CVPageProps) => { // https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
    return <>
        <meta charSet="utf-8" />
        <title>{props.data.strapiLeadcv.name} &ndash; Curriculum Vitae</title>
        <link rel="stylesheet" href="https://use.typekit.net/csn6djz.css"></link>
    </>;
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
            const pdfDisplay = pub.pdf ? <a className="pdf-download" href={pub.pdf.localFile.publicURL} download={downloadName}>(PDF)</a> : null;

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
                        {award=='other' && <i className="icon-other_award"></i> }
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
        const { data } = this.props;
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
                {/* <Helmet>
                    <meta charSet="utf-8" />
                    <title>{data.strapiLeadcv.name} &ndash; Curriculum Vitae</title>
                    <link rel="stylesheet" href="https://use.typekit.net/csn6djz.css"></link>
                </Helmet> */}
                <div className="row">
                    <div className="col side"></div>
                    <div className="col main">
                        <h1 className="name_header">{data.strapiLeadcv.name}</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col side"></div>
                    <div className="col main">
                        <div className="row">
                            <div className="col affiliation">
                                <div className="affiliation-department">{data.strapiLeadcv.affiliation.department}</div>
                                <div className="affiliation-university">{data.strapiLeadcv.affiliation.university}</div>
                                <div className="affiliation-office">{data.strapiLeadcv.affiliation.office}</div>
                                <div className="affiliation-street">{data.strapiLeadcv.affiliation.street}</div>
                                <div className="affiliation-city">{data.strapiLeadcv.affiliation.city}</div>
                            </div>
                            <div className="col contact">
                                <div className="contact-spacer"></div>
                                <div className="contact-spacer"></div>
                                <div className="contact-homepage"><a href={data.strapiLeadcv.contact.homepage}>{data.strapiLeadcv.contact.homepage}</a></div>
                                <div className="contact-phone"><a href={'tel:' + data.strapiLeadcv.contact.phone.replace(/\D/g, '')}>{data.strapiLeadcv.contact.phone}</a></div>
                                <div className="contact-email"><a href={'mailto:' + data.strapiLeadcv.contact.email}>{data.strapiLeadcv.contact.email}</a></div>
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
                    {
                        data.strapiLeadcv.education.map((edu) => (
                            <div className="row item" key={edu.id}>
                                <div className="col side col-2">
                                    {getDateRangeEl(edu.date_start, edu.date_end)}
                                    {getLocationEl(edu.location)}
                                </div>
                                <div className="col main col-8">
                                    <div className="education-school">{edu.university}</div>
                                    <table className="education-degrees">
                                        <tbody>
                                            {edu.degrees.strapi_json_value.map((degree, index) => (
                                                <tr key={index}><td>{degree[0]}&nbsp;</td><td>in {degree[1]}</td></tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {
                                        (edu.advisors || edu.committee) &&
                                            <table className="education-advisors">
                                                <tbody>
                                                    { edu.advisors && <tr><td>Advisors:&nbsp;</td><td>{edu.advisors}</td></tr> }
                                                    { edu.committee && <tr><td>Committee:&nbsp;</td><td>{edu.committee}</td></tr> }
                                                </tbody>
                                            </table>
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="section experience">
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-header">
                            <h2>Professional Experience</h2>
                        </div>
                    </div>
                    {
                        data.strapiLeadcv.professional_experience.map((exp) => (
                            <div className="row item" key={exp.id}>
                                <div className="col side">
                                    {getDateRangeEl(exp.date_start, exp.date_end)}
                                    {getLocationEl(exp.location)}
                                </div>
                                <div className="col main">
                                    <div className="experience-organization">{exp.institution}</div>
                                    <div className="experience-description">{exp.title}</div>
                                </div>
                            </div>
                        ))
                    }
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
                        <i className="icon-honorable_mention"></i>: honorable mention or other award
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
                    {
                        [
                            [`Heavily-reviewed Journal Manuscripts (${PUB_TYPES.JOURNAL})`, [PUB_TYPES.JOURNAL]],
                            [`Heavily-reviewed Conference Papers (${PUB_TYPES.CONFERENCE})`, [PUB_TYPES.CONFERENCE]],
                            [`Book Chapters (${PUB_TYPES.BOOK_CHAPTER})`, [PUB_TYPES.BOOK_CHAPTER]],
                            [`Refereed Posters (${PUB_TYPES.POSTER}), Workshops (${PUB_TYPES.WORKSHOP}), Doctoral Consortiums (${PUB_TYPES.DOCTORAL_CONSORTIUM}), Demos (${PUB_TYPES.DEMO}), and Panels (${PUB_TYPES.PANEL})`, [PUB_TYPES.POSTER, PUB_TYPES.WORKSHOP, PUB_TYPES.DOCTORAL_CONSORTIUM, PUB_TYPES.DEMO, PUB_TYPES.PANEL]],
                            [`Preprints (${PUB_TYPES.PREPRINT})`, [PUB_TYPES.PREPRINT]],
                            [`Theses (${PUB_TYPES.THESIS})`, [PUB_TYPES.THESIS]],
                        ].map(([sectionTitle, pubElementTypes]) => (
                            <>
                                <div className="row">
                                    <div className="col side"></div>
                                    <div className="col main section-subheader">
                                        <h3>{sectionTitle}</h3>
                                    </div>
                                </div>
                                {this.getPubElements(pubElementTypes as PUB_TYPES[])}
                            </>
                        ))
                    }
                </div>
                <div className="section grants">
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-header">
                            <h2>Grants</h2>
                        </div>
                    </div>
                    {
                        data.strapiLeadcv.grants.map((grant) => (
                            <div className="row item" key={grant.id}>
                                <div className="col side">
                                    <div className="date">{grant.date}</div>
                                    <div className="award-amount">{formatDollarAmount(grant.amount)}</div>
                                </div>
                                <div className="col main">
                                    {grant.title && <div className="award-title">{grant.title}</div>}
                                    <ReactMarkdown className="award-team">{grant.team}</ReactMarkdown>
                                    <div className="award-sponsor">{grant.sponsor}</div>
                                    {grant.program && <div className="award-program">{grant.program}</div>}
                                </div>
                            </div>
                        ))
                    }
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
                    {
                        [
                            ...data.strapiLeadcv.awards,
                            ...( includePaperAwards ? data.allStrapiPublication.nodes.filter((pub) => ( pub.award !== 'none')) : [])
                        ].sort((a, b) => {
                            function getDateString(x: Queries.STRAPI__COMPONENT_CV_AWARD|Queries.STRAPI_PUBLICATION) {
                                if(x.hasOwnProperty('venue')) {
                                    const venue = (x as Queries.STRAPI_PUBLICATION).venue;
                                    return `${venue.conference_start}/${venue.year}`;
                                } else {
                                    const award = x as Queries.STRAPI__COMPONENT_CV_AWARD;
                                    const dateStart = award.date_start.split('/');
                                    return `${dateStart[0]}/1/${dateStart[1]}`;
                                }
                            }
                            const aDate = new Date(getDateString(a)).getTime();
                            const bDate = new Date(getDateString(b)).getTime();
                            return bDate - aDate;
                        }).map((award: Queries.STRAPI__COMPONENT_CV_AWARD|Queries.STRAPI_PUBLICATION) => {
                            if(award.hasOwnProperty('venue')) { // publication
                                const pub = award as Queries.STRAPI_PUBLICATION;

                                return <div className="row item">
                                    <div className="col side">
                                        <div className="date">{getVenueMonthYear(pub.venue)}</div>
                                    </div>
                                    <div className="col main">
                                        <div className="award-title">{pub.venue.name_year}: {getAwardText(pub.award, pub.award_description)}</div>
                                        <i>{pub.title}</i>
                                    </div>
                                </div>;
                            } else {
                                const award_item = award as Queries.STRAPI__COMPONENT_CV_AWARD;
                                return <div className="row item" key={award_item.id}>
                                    <div className="col side">
                                        {getDateRangeEl(award_item.date_start, award_item.date_end)}
                                    </div>
                                    <div className="col main">
                                        <div className="award-title">{award_item.title}</div>
                                        {award_item.description && <div className="award-description">{award_item.description}</div>}
                                    </div>
                                </div>
                            }
                        })
                    }
                </div>
                <div className="section presentations">
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-header">
                            <h2>Invited Presentations</h2>
                        </div>
                    </div>
                    {
                        data.strapiLeadcv.invited_presentations.map((talk, index) => (
                            <div className="row item" key={talk.id}>
                                <div className="col side">
                                    <div className="date">{talk.date}</div>
                                    <div className="location">{talk.location}</div>
                                </div>
                                <div className="col main">
                                    <div className="talk-location">{talk.institution}</div>
                                    <div className="talk-title">{talk.title}</div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="section service">
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-header">
                            <h2>Service</h2>
                        </div>
                    </div>
                    {
                        [
                            [`Organizing Committee`, 'organizing_committee'],
                            [`Program Committee`, 'program_committee'],
                            [`Peer Reviewing`, 'peer_review'],
                            [`Operations Committee`, 'operations_committee'],
                            [`UMSI`, 'department'],
                            [`Other`, 'other'],
                        ].map(([sectionTitle, category]) => (
                            <>
                                <div className="row">
                                    <div className="col side"></div>
                                    <div className="col main section-subheader">
                                        <h3>{sectionTitle}</h3>
                                    </div>
                                </div>
                                {
                                    data.strapiLeadcv.service.filter((service_item) => service_item.category === category).map((service_item) => (
                                        <div className="row item" key={service_item.id}>
                                            <div className="col side">
                                                {getDateRangeEl(service_item.date_start, service_item.date_end)}
                                            </div>
                                            <div className="col main">
                                                <div className="role">{service_item.title}</div>
                                                {service_item.description && <div className="venue">{service_item.description}</div>}
                                            </div>
                                        </div>
                                    ))
                                }
                            </>
                        ))
                    }
                </div>
                <div className="section teaching">
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-header">
                            <h2>Teaching</h2>
                        </div>
                    </div>

                    {
                        data.strapiLeadcv.teaching.map((teaching) => (
                            <div className="row item">
                                <div className="col side">
                                    <div className="date-range">{getDateRangeEl(teaching.date_start, teaching.date_end)}</div>
                                    <div className="location">{teaching.institution}</div>
                                </div>
                                <div className="col main">
                                    <div className="course-name">{teaching.title}</div>
                                    <ReactMarkdown className="course-description">{teaching.description}</ReactMarkdown>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="section supervisees">
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-header">
                            <h2>Students Supervised</h2>
                        </div>
                    </div>
                    {
                        [
                            [`Dissertation Chair (Ph.D. Graduates)`, 'dissertation_chair'],
                            [`Ph.D. Advisees (Ongoing)`, 'ongoing_advisee'],
                            [`Thesis Committees (Ph.D.)`, 'phd_thesis_committee'],
                            [`Thesis Chair (M.S.)`, 'ms_thesis_chair'],
                            [`Thesis Committees (M.S.)`, 'ms_thesis_committee'],
                            [`Thesis Chair (Undergraduate)`, 'ugrad_thesis_chair'],
                        ].map(([sectionTitle, category]) => (
                            <>
                                <div className="row">
                                    <div className="col side"></div>
                                    <div className="col main section-subheader">
                                        <h3>{sectionTitle}</h3>
                                    </div>
                                </div>
                                {
                                    data.strapiLeadcv.supervised_students.filter((student) => student.category === category).map((student) => (
                                        <div className="row item" key={student.id}>
                                            <div className="col side">
                                                {getDateRangeEl(student.date_start, student.date_end)}
                                                <div className="location">{student.institution}</div>
                                            </div>
                                            <div className="col main">
                                                <div className="supervisee">{student.student_name}{student.student_department && ` (${student.student_department})`}</div>
                                                {student.thesis_title && <div className="supervisee-thesis">{student.thesis_title}</div>}
                                                {student.coadvisor && <div className="supervisee-coadvisor">(co-advised with {student.coadvisor})</div>}
                                                {student.current_position && <div className="supervisee-position">Currently: {student.current_position}</div>}
                                            </div>
                                        </div>
                                    ))
                                }
                            </>
                        ))
                    }
                    <div className="row d-print-none">
                        <div className="col side"></div>
                        <div className="col main">
                            <input id="iucheckbox" type="checkbox" checked={this.state.showAllUndergraduateCollaborators} onChange={iuChange} />&nbsp;<label htmlFor="iucheckbox">Include Undergraduate Collaborators</label>
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
                                        {
                                            data.allStrapiAuthor.nodes.map((author) => (
                                                <li key={author.id}>{author.given_name} {author.family_name} {author.short_bio && `(${author.short_bio})`}</li>
                                            ))
                                        }
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

                    {
                        data.strapiLeadcv.press.map((press) => (
                            <div className="row item" key={press.id}>
                                <div className="col side">
                                    <div className="outlet">{press.publication}</div>
                                </div>
                                <div className="col main">
                                    <div className="title"><a href={press.link}>{press.title}</a></div>
                                    <div className="date">{press.description}</div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="section patents">
                    <div className="row">
                        <div className="col side"></div>
                        <div className="col main section-header">
                            <h2>Patent</h2>
                        </div>
                    </div>

                    {
                        data.strapiLeadcv.patents.map((patent) => (
                            <div className="row" key={patent.id}>
                                <div className="col side">
                                    {getDateRangeEl(patent.date)}
                                </div>
                                <div className="col main">{patent.title}</div>
                            </div>
                        ))
                    }
                </div>
            </div>;
    }
}

function getLocationEl(loc: string): JSX.Element {
    return <div className="location">{loc}</div>;
}
function getDateRangeEl(start: string, end?: string): JSX.Element {
    const startEl = start && getDateItem(start);
    const endEl   = end   && getDateItem(end  );

    if(startEl && endEl) {
        return <div className="date-range">{startEl} &ndash; {endEl}</div>;
    } else {
        return <div className="date">{startEl || endEl}</div>;
    }
}
function getDateItem(d: string): JSX.Element | string {
    if(d === 'present') {
        return <i>present</i>;
    } else {
        return d;
    }
}
function formatDollarAmount(value: number): string {
    const formattedValue = value.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
    return `$${formattedValue}`;
}
function getVenueMonthYear(venue: Queries.STRAPI_VENUE): string {
    return `${venue.conference_start.split('/')[0].padStart(2, '0')}/${venue.year}`;
}