import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import dynamic from 'next/dynamic'
import Link from "next/link";
import style from './card.module.css'
import LovePost from "../forms/LovePost";
import Subscribe from "../forms/Subscribe";
import CollectPost from "../forms/CollectPost";
import SharePost from "../forms/SharePost";

interface Props {
    id: string,
    currentUserId: string,
    parentId: string | null,
    content: string,
    author: {
        name: string;
        image: string;
        id: string;

    }
    community: {
        name: string;
        image: string;
        id: string
    } | null,
    createdAt: string,
    comments: {
        author: {
            image: string
        },

    }[],
    iscomment?: boolean
    islike?: boolean
    isinterest?: boolean
    iscollect?: Boolean
    title?: string,
    tags?: string[]
    pageviwe?: string[]
}
const DelePosts = dynamic(() => import('../forms/DeleteThread'));

export default function ThreadCard({
    id,
    currentUserId,
    parentId,
    content,
    author,
    community,
    createdAt,
    comments,
    iscomment,
    islike,
    isinterest,
    iscollect,
    title,
    tags,
    pageviwe
}: Props
) {
    return (
        <article
            className={`flex w-[96%] ml-[2%] flex-col rounded-xl ${iscomment ?
                'px-0 xs:px-7' :
                'bg-dark-2 p-7'
                }`}>
            <div className="flex item-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-4">
                    <div className="flex flex-col items-center">
                        <Link href={`profile/${author.id}`} className="relative h-11 w-11 mt-[-10px]" prefetch={false}>
                            <Image
                                src={author.image}
                                alt="profile_photo"
                                fill
                                className="cursor-pointer rounded-full"
                            >

                            </Image>

                        </Link >
                        <div className="thread-card_bar" />
                    </div>

                    <div className="flex w-full flex-col">
                        <div className="flex">
                            <Link href={`profile/${author.id}`} className="flex w-fit " style={{ width: '80%' }} prefetch={false}>
                                <h4 className="cursor-pointer text-base-semibold text-light-1">
                                    {author.name}
                                </h4>


                            </Link>
                            {

                                isinterest != undefined && (
                                    <Subscribe
                                        issub={isinterest}
                                        currentid={currentUserId}
                                        authorid={author.id}
                                    />
                                )
                            }
                        </div>

                        <p className="mt-2 text-small-regular text-light-2">
                            {content}
                        </p>
                        {title && (
                            <div style={{ color: 'rgb(105,124,137)', marginTop: '5px' }}>
                                {title}
                                {tags && (
                                    <div>
                                        {
                                            tags.map((item, index) => {
                                                return <span key={index} className={style.tags}>#{item}</span>
                                            })
                                        }
                                    </div>
                                )}
                            </div>
                        )}

                        <div className={` ${iscomment && 'mb-10'} mt-5 flex flex-col gap-3`}>
                            <div className="flex gap-3.5">
                                {
                                    !iscomment && (
                                        <>
                                            <Image
                                                src='/assets/pageview.svg'
                                                alt="heart"
                                                width={24}
                                                height={24}
                                                className="cursor-pointer object-contain"

                                            />
                                            <p style={{ fontSize: '13px', marginTop: '2px' }}>{pageviwe ? pageviwe.length : 0}</p>
                                            &nbsp;
                                        </>
                                    )
                                }

                                <LovePost
                                    userId={currentUserId}
                                    threadId={JSON.stringify(id)}
                                    islike={islike}
                                    authorId={author.id}
                                />

                                <Link href={`/thread/${id}`} >
                                    <Image
                                        src='/assets/comments.svg'
                                        alt="heart"
                                        width={24}
                                        height={24}
                                        className="cursor-pointer object-contain" ></Image>
                                </Link>

                                {/* <Image
                                    src='/assets/share.svg'
                                    alt="heart"
                                    width={24}
                                    height={24}
                                    className="cursor-pointer object-contain" ></Image> */}
                                {/* <FacebookShareButton
                               
                                    url={'[4](https://github.com/next-share)'}
                                    quote={'next-share is a social share buttons for your next React apps.'}
                                    hashtag={'#nextshare'}
                                >
                                    <FacebookIcon size={32} round />
                                </FacebookShareButton> */}
                                <SharePost />
                                <CollectPost
                                    userId={currentUserId}
                                    threadId={JSON.stringify(id)}
                                    islike={iscollect}
                                />
                            </div>
                            {
                                !iscomment && comments.length > 0 && (
                                    <Link

                                        href={`/thread/${id}`}
                                    >
                                        <p className="mt-1 text-subtle-medium text-gray-1">
                                            {comments.length} repl{comments.length > 1 ? 'ies' : 'y'}
                                        </p>
                                    </Link>
                                )
                            }
                        </div>
                    </div>
                </div>
                {
                    currentUserId == author.id && (
                        <DelePosts
                            threadId={JSON.stringify(id)}
                            currentUserId={currentUserId}
                            authorId={author.id}
                            parentId={parentId}
                            isComment={iscomment}
                        />
                    )
                }

            </div>
            {!iscomment && comments.length > 0 && (
                <div className="l1-1 mt-3 flex items-center gap-2">
                    {
                        comments.map((commit, index) => {
                            return (
                                <Image
                                    src={commit.author.image}
                                    key={index}
                                    width={24}
                                    height={24}
                                    alt="people"
                                    className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
                                >
                                </Image>
                            )
                        })

                    }
                    <Link href={`/thread/${id}`} >
                        <p className='mt-1 text-subtle-medium text-gray-1'>
                            {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                        </p>
                    </Link>

                </div>
            )
            }


            {
                !iscomment && community && (
                    <Link
                        href={`/communities/${community.id}`}
                        className='mt-5 flex items-center'
                    >
                        <p className="text-subtle-medium text-gray-1">
                            {formatDateString(createdAt)}
                            {" "} {`-${community.name} community`}
                        </p>
                        <Image
                            src={community.image}
                            alt="community"
                            width={14}
                            height={14}
                            className="ml-1 rounded-full object-cover"
                        >

                        </Image>
                    </Link>
                )
            }


        </article>
    )
}
