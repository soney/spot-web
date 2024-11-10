import { Link } from 'gatsby';
import * as React from 'react';
import ReactMarkdown from 'react-markdown'
import { chunk } from 'lodash';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used
import { House } from 'lucide-react';
import { GatsbyImage, getImage } from "gatsby-plugin-image";

export enum MemberListLayout {
    short_horizontal='short_horizontal', full_vertical='full_vertical', tiny_head='tiny_head', simple_list='simple_list'
}

interface MemberListDisplayProps {
    data: ReadonlyArray<Queries.STRAPI_AUTHOR>,
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
            const memberDisplays = data.map((node: Queries.STRAPI_AUTHOR) => (
                <MemberDisplay key={node.id} highlightPubs={this.props.highlightPubs} data={node} layout={this.props.layout} />
            ));
            return <div className="container"> {memberDisplays} </div>;
        } else if(layout === MemberListLayout.short_horizontal) {
            // const col_count = Math.floor(12/data.length);
            const memberDisplays = data.map((node: Queries.STRAPI_AUTHOR) => (
                <div key={node.id} className={`member p-1`}><MemberDisplay layout={this.props.layout} highlightPubs={this.props.highlightPubs} data={node} /></div>
            ));
            return <div className="">
                <div className="flex-row d-flex">
                    {memberDisplays}
                </div>
            </div>;
        } else if(layout === MemberListLayout.tiny_head) {
            // const col_count = Math.floor(12/data.length);
            const memberDisplays = data.map((node: Queries.STRAPI_AUTHOR) => (
                <div key={node.id} className={`col col-md-2`}><MemberDisplay layout={this.props.layout} highlightPubs={this.props.highlightPubs} data={node} /></div>
            ));
            return <div className="container">
                <div className="row">
                    {memberDisplays}
                </div>
            </div>;
        } else if(layout === MemberListLayout.simple_list) {
            const memberDisplays = data.map((node: Queries.STRAPI_AUTHOR) => (
                node.homepage ?
                <li key={node.id}><a href={node.homepage}>{`${node.given_name} ${node.family_name}`}</a>{node.short_bio && ` (${node.short_bio})`}</li> :
                <li key={node.id}>{`${node.given_name} ${node.family_name}`}{node.short_bio && ` (${node.short_bio})`}</li>
            ));
            const chunkedMemberDisplays = chunk(memberDisplays, Math.ceil(data.length/3));
            const allCols = chunkedMemberDisplays.map((lst, i) => {
                return <ul className="col-md-4" key={i}>{lst}</ul>
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
    data: Queries.STRAPI_AUTHOR,
    layout: MemberListLayout,
    highlightPubs: boolean
}
interface MemberDisplayState {
    highlighted: boolean
}

class MemberDisplay extends React.Component<MemberDisplayProps, MemberDisplayState> {
    constructor(props: MemberDisplayProps) {
        super(props);
        this.state = { highlighted: false };
    }
    private pubListElements: ChildNode[];
    public render(): JSX.Element {
        const { data } = this.props;
        const { id, given_name, family_name, short_bio, long_bio, homepage, links } = data;
        const color = data.color || '#FFFF00';

        const highlightMember = () => {
            this.setState({highlighted: true});
            if(this.props.highlightPubs) {
                const pubList = document.querySelector('.publication-list');
                this.pubListElements = Array.from(pubList.childNodes);
                const memberElement: Element = document.querySelector(`.member-display[data-member-id='${id}'] .member-name`);
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
                    const authorIDs = authors.split(',');//.map((a) => parseInt(a));
                    if(authorIDs.indexOf(id) >= 0) {
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

                const authorElements = document.querySelectorAll(`.paper-author[data-author-id='${id}']`);

                authorElements.forEach((el) => {
                    el.classList.add('hover-highlight');
                    el.setAttribute('style', `background-color: ${color}`);
                });
            }
        };
        const unhighlightMember = () => {
            this.setState({highlighted: false});
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
            const linksElements = (links ?? []).map((l) => {
                return <li key={l.id} className="breadcrumb-item"><a href={l.url} target='_blank'>{l.description}</a></li>
            });
            // const mediaElements = media.map((m) => {
            //     return <li key={m.id} className="breadcrumb-item"><a href={m.media.publicURL} download={`${family_name}-${m.description}`} target='_blank'>{m.description}</a></li>
            // })
            return <div className="row member-row">
                <div className="col-sm-2">
                    {data.headshot && 
                    <GatsbyImage image={data.headshot.localFile.childImageSharp.gatsbyImageData} className="member-headshot" title={`Headshot of ${given_name} ${family_name}`} alt={`Headshot of ${given_name} ${family_name}`} imgStyle={{borderRadius: 3}} />
                    }
                </div>
                <div className="col-sm-10">
                    <h3>{`${given_name} ${family_name}`}</h3>
                    <ReactMarkdown>{long_bio}</ReactMarkdown>
                    <ul className="breadcrumb">
                        {/* <li className="breadcrumb-item"><FontAwesomeIcon icon={solid("house")} />&nbsp;<a href={homepage} target='_blank'>Homepage</a></li> */}
                        <li className="breadcrumb-item"><House size={18} />&nbsp;<a href={homepage} target='_blank'>Homepage</a></li>
                        {linksElements}
                        {/* {mediaElements} */}
                    </ul>
                </div>
            </div>
        } else {
            const memberContent: (JSX.Element|false)[] = [
                data.headshot ? <GatsbyImage key="img" image={data.headshot.localFile.childImageSharp.gatsbyImageData} className="member-headshot" title={`Headshot of ${given_name} ${family_name}`} alt={`Headshot of ${given_name} ${family_name}`} imgStyle={{borderRadius: 3}} /> : false,
                <div key="name">
                    <span className="member-name">{`${given_name} ${family_name}`}</span>
                </div>,
                <div key="short-bio" className="member-short-bio d-none d-sm-block">{short_bio}</div>,
                // <button className="member-focus btn btn-block btn-small btn-link" onClick={highlightMember}>highlight</button>
            ];
            if(data.use_local_homepage) {
                return <Link aria-label={`${data.given_name} ${data.family_name}`} onMouseEnter={highlightMember} onMouseLeave={unhighlightMember} className="member-display" data-member-id={id} to={`/${data.given_name}_${data.family_name}`}>{memberContent}</Link>;
            } else {
                return <a aria-label={`${data.given_name} ${data.family_name}`} onMouseEnter={highlightMember} onMouseLeave={unhighlightMember} className="member-display" data-member-id={id} href={data.homepage} target="_blank">{memberContent}</a>;
            }
        }
    }
}