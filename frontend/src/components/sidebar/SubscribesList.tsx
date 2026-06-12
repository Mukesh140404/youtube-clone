import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { allSubscribedChannelOfUser } from '@/client/subscription.api'
import { useUserStore } from '@/store/useUserStore'
const SubscribesList = () => {

    // const {data:subscriptions} = useQuery({
    //     queryKey:
    // })
    const user = useUserStore((state) => state.user)
    const { data: subscriptions} = useQuery({
        queryKey: ["userSubscribers"],
        queryFn: () => allSubscribedChannelOfUser(user?._id),
    });
    // console.log(subscriptions)
    // return
    return (
        <div className="py-3 border-b border-gray-100 dark:border-[#272727]">
            <div className="px-5 py-2">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    Subscriptions
                </h3>
            </div>
            {
                subscriptions && subscriptions.count > 0 ? (
                    <div>
                        {subscriptions.channels.map((sub: any) => {
                            
                            return (
                                <Link
                                    key={sub.channel._id}
                                    to="/$userId"
                                    params={{ userId: sub.channel.username }}
                                    className="flex items-center px-4 py-2 mx-3 rounded-xl hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors group"
                                >
                                    <img
                                        src={sub.channel.avatar}
                                        alt={sub.channel.username}
                                        className={`w-6 h-6 rounded-full mr-4 border ${sub.isActive ? 'border-blue-500 p-px' : 'border-gray-200 dark:border-[#3f3f3f]'}`}
                                    />
                                    <span className={`text-sm font-medium truncate ${sub.isActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-[#aaaaaa]'}`}>
                                        {sub.channel.username}
                                    </span>
                                    {/* {sub.isActive && (
                                        <span className="w-1 h-1 bg-blue-600 rounded-full ml-auto"></span>
                                    )} */}
                                </Link>
                            )
                        })}
                    </div>
                ) : (
                    <div className='text-gray-600 dark:text-[#f1f1f1cd] text-xs px-5'>
                        You are not subscribe any channel yet
                    </div>
                )
            }

            {subscriptions?.count > 5 && <button className="flex items-center px-4 py-2.5 mx-3 w-[calc(100%-24px)] rounded-xl hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors group text-gray-800 dark:text-[#f1f1f1]">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 mr-4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                </svg>
                <span className="text-sm font-medium">Show more</span>
            </button>}
        </div>
    )
}

export default SubscribesList