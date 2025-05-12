import { Link } from 'gatsby';
import * as React from 'react';
import { AuthorListDisplay } from './authors';
import { PublicationDetailLevel } from './publication-list';

import { Trophy, Award, FileDown } from 'lucide-react';

// import { config } from "@fortawesome/fontawesome-svg-core";
// import "@fortawesome/fontawesome-svg-core/styles.css";
// config.autoAddCss = false

interface PublicationSummaryDisplayProps {
    data: Queries.STRAPI_PUBLICATION
    highlightAuthors?: string[]
    detailLevel: PublicationDetailLevel
}

export class PublicationSummaryDisplay extends React.Component<PublicationSummaryDisplayProps, {}> {
    constructor(props: PublicationSummaryDisplayProps) {
        super(props);
    }
    public render(): JSX.Element {
        const { data } = this.props;
        const { venue } = data;
        const authors = Array.from(data.authors) as any as Queries.STRAPI_AUTHOR[];
        const downloadName = getDownloadName(data);

        let venue_str: string|JSX.Element = '';
        if(venue) {
            if(venue) {
                venue_str = `${venue.short_name} ${venue.year}`;
            } else {
                venue_str = `${venue.year}`;
            }

            if(venue.homepage) {
                venue_str = <a target='_blank' href={venue.homepage}>{venue_str}</a>;
            }
        } else {
            venue_str = ``;
        }
        // const pdfDisplay = data.pdf ? <a className="pdf-download" href={data.pdf.localFile.publicURL} download={downloadName}><FontAwesomeIcon icon={regular("file-pdf")} /> PDF</a> : null;
        const pdfDisplay = data.pdf ? <a className="pdf-download" href={data.pdf.localFile.publicURL} download={downloadName}><FileDown size={18} /> PDF</a> : null;
        const condAcceptDisplay = data.submission_status === 'conditionally_accepted' ? <span className="conditionally_accepted">(conditionally accepted)</span> : null;

        if(this.props.detailLevel === PublicationDetailLevel.title) {
            return <Link className="paper-title" to={`/${downloadName}`}>{data.title}</Link>;
        } else {
            return <div className="paper row" data-authors={authors.map((a) => a.id).join(',')}>
                <div className="col-sm-10">
                    <Link className="paper-title" to={`/${downloadName}`}>{data.title}</Link>
                    <div className="paper-authors"><AuthorListDisplay authors={authors} withLinks={true} highlightAuthors={this.props.highlightAuthors} /></div>
                    {data.short_description && <p className="paper-description d-none d-md-block">{data.short_description}</p>}
                </div>
                <div className="col-sm-2 text-left">
                    <div className="paper-venue d-inline d-md-block">{venue_str}<span className="d-inline d-md-none">&nbsp;</span></div>
                    {data.submission_status === 'conditionally_accepted' && <div className="paper-condaccept d-inline d-md-block">{condAcceptDisplay}<span className="d-inline d-md-none">&nbsp;</span></div> }
                    {data.award !== 'none' && <div className="paper-award d-inline d-md-block"><AwardDisplay data={data.award} description={data.award_description} /><span className="d-inline d-md-none">&nbsp;</span></div> }
                    <div className="paper-pdf d-inline d-md-block">{pdfDisplay}</div>
                </div>
            </div>;
        }
    }
}

enum AwardType {
    best_paper,
    honorable_mention,
    other,
    none
};
interface AwardDisplayProps {
    data: string|null,
    description: string|null
}
export class AwardDisplay extends React.Component<AwardDisplayProps, {}> {
    private type: AwardType;
    private description: string;
    constructor(props: AwardDisplayProps, context: {}) {
        super(props, context)
        if(this.props.data === 'best_paper') {
            this.type = AwardType.best_paper;
            this.description = getAwardText(this.props.data, this.props.description);
            // this.description = this.props.description ? this.props.description : 'Best Paper';
        } else if(this.props.data === 'honorable_mention') {
            this.type = AwardType.honorable_mention;
            this.description = getAwardText(this.props.data, this.props.description);
            // this.description = this.props.description ? this.props.description : 'Honorable Mention';
        } else if(this.props.data === 'other') {
            this.type = AwardType.other;
            this.description = getAwardText(this.props.data, this.props.description);
            // this.description = this.props.description ? this.props.description : 'Award';
        } else {
            this.type = AwardType.none;
            this.description = getAwardText(this.props.data, this.props.description);
            // this.description = this.props.description ? this.props.description : '';
        }
    }
    public render():JSX.Element {

        // const iconDisplay = (this.type === AwardType.best_paper) ? <FontAwesomeIcon icon={solid("trophy")} /> :
        //                 ((this.type === AwardType.honorable_mention) ? <FontAwesomeIcon icon={solid("award")} /> : 
        //                 (this.type === AwardType.other) ? <FontAwesomeIcon icon={solid("award")} /> : null);
        const iconDisplay = (this.type === AwardType.best_paper) ? <Trophy size={18} /> :
                        ((this.type === AwardType.honorable_mention) ? <Award size={18} /> : 
                        (this.type === AwardType.other) ? <Award size={18} /> : null);
                    
        return <span className='paper-award'>{iconDisplay} {this.description}</span>;
    }
}

export function getAwardText(award: string, award_description: string): string {
    if(award_description) {
        return award_description;
    } else if(award === 'best_paper') {
        return 'Best Paper';
    } else if(award === 'honorable_mention') {
        return 'Honorable Mention';
    } else if(award === 'other') {
        return 'Award';
    } else {
        return '';
    }
}

export function getDownloadName(pub: Queries.STRAPI_PUBLICATION): string {
    let shortAuthors: string = '';
    if(pub.authors.length === 1) {
        shortAuthors = `${pub.authors[0].family_name}`;
    } else if(pub.authors.length === 2) {
        shortAuthors = `${pub.authors[0].family_name} and ${pub.authors[1].family_name}`;
    } else if(pub.authors.length > 2) {
        shortAuthors = `${pub.authors[0].family_name} et al`;
    }
    let short_venue_year: string = '';
    if(pub.venue) {
        if(pub.venue.short_name) {
            short_venue_year = `${pub.venue.short_name}${pub.venue.year}`;
        } else {
            short_venue_year = `${pub.venue.year}`;
        }
    } else {
        short_venue_year = ``;
    }
    return `${shortAuthors}-${short_venue_year}-${pub.title}`.replace(/ /g, '_').replace(/[^\w_-]/g, '');
}

export function getDateRangeString(from: Date, to: Date): string {
    const fromYear = from.toLocaleString('default', { year: 'numeric' });
    const toYear = to.toLocaleString('default', { year: 'numeric' });
    const fromMonth = from.toLocaleString('default', { month: 'short' });
    const toMonth = to.toLocaleString('default', { month: 'short' });
    const fromDay = from.toLocaleString('default', { day: 'numeric' });
    const toDay = to.toLocaleString('default', { day: 'numeric' });

    if(fromYear === toYear) {
        if(fromMonth === toMonth) {
            if(fromDay === toDay) {
                return `${fromMonth} ${fromDay}`;
            } else {
                return `${fromMonth} ${fromDay} – ${toDay}`;
            }
        } else {
            return `${fromMonth} ${fromDay} – ${toMonth} ${toDay}`;
        }
    } else {
        return `${fromMonth} ${fromDay} ${fromYear} – ${toMonth} ${toDay} ${toYear}`;
    }
}