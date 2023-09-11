import { currentUser } from '@clerk/nextjs'
import styles from '../page.module.css'
import { redirect } from 'next/navigation'
import { fetchuser, getAacivity } from '@/lib/actions/user.actions'
import Image from 'next/image'
import Link from 'next/link';


async function page() {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchuser(user.id);
  if (!userInfo.onboarded) redirect('/onboarding')
  const activity = await getAacivity(userInfo._id);

  return (
    <div className={styles.all}>
      <h1 className='head-text mb-10'>
        activity
      </h1>
      <section className='mt-10 flex flex-col gap-5'>
        {
          activity.length > 0 ? (
            <>
              {
                activity.map((activit) => {
                  return (
                    <Link
                      key={activit._id}
                      href={`/thread/${activit.parentId}`}
                    >
                      <article className='activity-card'>
                        <Image
                          src={activit.author.image}
                          alt="head"
                          width={20}
                          height={20}
                          className='rounded-full
                          object-cover
                          '
                        />
                          <p className='!text-small-regular text-light-1'>
                    <span className='mr-1 text-primary-500'>
                      {activit.author.name}
                    </span>{" "}
                    replied to your thread
                  </p>
                      </article>
                    </Link>
                  )
                })
              }
            </>
          ) : <p>
            there is no data
          </p>
        }
      </section>

    </div>
  )
}

export default page