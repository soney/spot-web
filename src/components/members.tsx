import Img from 'gatsby-image';
import Link from 'gatsby-link';
import * as React from 'react';
import { StrapiAuthor } from '../../graphql-types';
import * as ReactMarkdown from 'react-markdown';
import { chunk } from 'lodash';

export enum MemberListLayout {
    short_horizontal='short_horizontal', full_vertical='full_vertical', tiny_head='tiny_head', simple_list='simple_list'
}

interface MemberListDisplayProps {
    data: ReadonlyArray<StrapiAuthor>,
    highlightPubs: boolean,
    layout: MemberListLayout
}

export class MemberListDisplay extends React.Component<MemberListDisplayProps, {}> {
    constructor(props: MemberListDisplayProps) {
        super(props);
    }
    public render() {
        const { data, layout } = this.props;

        if(layout === MemberListLayout.full_vertical) {
            const memberDisplays = data.map((node: StrapiAuthor) => (
                <MemberDisplay key={node.id} highlightPubs={this.props.highlightPubs} data={node} layout={this.props.layout} />
            ));
            return <div className="container"> {memberDisplays} </div>;
        } else if(layout === MemberListLayout.short_horizontal) {
            // const col_count = Math.floor(12/data.length);
            const memberDisplays = data.map((node: StrapiAuthor) => (
                <div key={node.id} className={`col col-md-`}><MemberDisplay layout={this.props.layout} highlightPubs={this.props.highlightPubs} data={node} /></div>
            ));
            return <div className="container">
                <div className="row">
                    {memberDisplays}
                </div>
            </div>;
        } else if(layout === MemberListLayout.tiny_head) {
            // const col_count = Math.floor(12/data.length);
            const memberDisplays = data.map((node: StrapiAuthor) => (
                <div key={node.id} className={`col col-md-2`}><MemberDisplay layout={this.props.layout} highlightPubs={this.props.highlightPubs} data={node} /></div>
            ));
            return <div className="container">
                <div className="row">
                    {memberDisplays}
                </div>
            </div>;
        } else if(layout === MemberListLayout.simple_list) {
            const memberDisplays = data.map((node: StrapiAuthor) => (
                node.homepage ?
                <li key={node.id}><a href={node.homepage}>{`${node.given_name} ${node.family_name}`}</a>{node.short_bio && ` (${node.short_bio})`}</li> :
                <li key={node.id}>{`${node.given_name} ${node.family_name}`}{node.short_bio && ` (${node.short_bio})`}</li>
            ));
            const chunkedMemberDisplays = chunk(memberDisplays, Math.round(data.length/3));
            const allCols = chunkedMemberDisplays.map((lst) => {
                return <ul className="col col-md-4">{lst}</ul>
            })
            return <div className="container">
                <div className="row">
                    {allCols}
                </div>
            </div>;
        } else {
            return;
        }
    }
}

interface MemberDisplayProps {
    data: StrapiAuthor,
    layout: MemberListLayout,
    highlightPubs: boolean
}

class MemberDisplay extends React.Component<MemberDisplayProps, {}> {
    constructor(props: MemberDisplayProps) {
        super(props);
    }
    private pubListElements: ChildNode[];
    public render(): JSX.Element {
        const { data } = this.props;
        const { strapiId, given_name, family_name, short_bio, long_bio, homepage, links, media } = data;
        const color = data.color || '#FFFF00';

        const highlightMember = () => {
            if(this.props.highlightPubs) {
                const pubList = document.querySelector('.publication-list');
                this.pubListElements = Array.from(pubList.childNodes);
                const memberElement: Element = document.querySelector(`.member-display[data-member-id='${strapiId}'] .member-name`);
                if(memberElement) {
                    memberElement.classList.add('hover-highlight');
                    memberElement.setAttribute('style', `background-color: ${color}`);
                }

                const paperRows = document.querySelectorAll('.paper');
                const relevantPaperRows: Element[] = [];
                const notRelevantPaperRows: Element[] = [];
                for(let i: number = 0; i<paperRows.length; i++) {
                    const row = paperRows.item(i);
                    const authors = row.getAttribute('data-authors')
                    const authorIDs = authors.split(',').map((a) => parseInt(a));
                    if(authorIDs.indexOf(strapiId) >= 0) {
                        relevantPaperRows.push(row);
                    } else {
                        notRelevantPaperRows.push(row);
                    }
                }

                relevantPaperRows.forEach((el: Element) => {
                    el.classList.add('hover-highlight');
                });
                notRelevantPaperRows.forEach((el: Element) => {
                    el.classList.add('hover-no-highlight');
                    el.setAttribute('style', `opacity: 0.4`);
                    const li=el.parentElement;
                    li.parentElement.append(li);
                });

                const authorElements = document.querySelectorAll(`.paper-author[data-author-id='${strapiId}']`);

                authorElements.forEach((el) => {
                    el.classList.add('hover-highlight');
                    el.setAttribute('style', `background-color: ${color}`);
                });
            }
        };
        const unhighlightMember = () => {
            if(this.props.highlightPubs) {
                const pubList = document.querySelector('.publication-list');
                this.pubListElements.forEach((el) => {
                    pubList.append(el);
                })
                const memberElement = document.querySelector(`.member-display .member-name.hover-highlight`);
                if(memberElement) {
                    memberElement.classList.remove('hover-highlight');
                    memberElement.removeAttribute('style');
                }

                const relevantPaperRows = document.querySelectorAll(`.paper.hover-highlight,.paper.hover-no-highlight`);
                relevantPaperRows.forEach((el) => {
                    el.classList.remove('hover-highlight');
                    el.classList.remove('hover-no-highlight');
                    el.removeAttribute('style');
                });
                const authorElements = document.querySelectorAll(`.paper-author.hover-highlight`);
                authorElements.forEach((el) => {
                    el.classList.remove('hover-highlight');
                    el.removeAttribute('style');
                });
            }
        };

        if(this.props.layout===MemberListLayout.full_vertical) {
            const linksElements = links.map((l) => {
                return <li key={l.id} className="breadcrumb-item"><a href={l.url} target='_blank'>{l.description}</a></li>
            });
            const mediaElements = media.map((m) => {
                return <li key={m.id} className="breadcrumb-item"><a href={m.media.publicURL} download={`${family_name}-${m.description}`} target='_blank'>{m.description}</a></li>
            })
            return <div className="row member-row">
                <div className="col col-md-2">
                    <Img className="member-headshot" fluid={data.headshot.childImageSharp.fluid as any} alt={`Headshot of ${given_name} ${family_name}`} />
                </div>
                <div className="col col-md-10">
                    <h3>{`${given_name} ${family_name}`}</h3>
                    <ReactMarkdown source={long_bio} />
                    <ul className="breadcrumb">
                        <li className="breadcrumb-item"><i className="fas fa-home" />&nbsp;<a href={homepage} target='_blank'>Homepage</a></li>
                        {linksElements}
                        {mediaElements}
                    </ul>
                </div>
            </div>
        } else {
            const memberContent: JSX.Element[] = [
                <Img className="member-headshot" fluid={data.headshot.childImageSharp.fluid as any} alt={`Headshot of ${given_name} ${family_name}`} />,
                <div>
                    <span className="member-name">{`${given_name} ${family_name}`}</span>
                </div>,
                <div className="member-short-bio d-none d-sm-block">{short_bio}</div>
            ];
            if(data.use_local_homepage) {
                return <Link onMouseEnter = {highlightMember} onMouseLeave = {unhighlightMember} className="member-display" data-member-id={strapiId} to={`/${data.given_name}_${data.family_name}`}>{memberContent}</Link>;
            } else {
                return <a onMouseEnter={highlightMember} onMouseLeave={unhighlightMember} className="member-display" data-member-id={strapiId} href={data.homepage} target="_blank">{memberContent}</a>;
            }
        }
    }
}