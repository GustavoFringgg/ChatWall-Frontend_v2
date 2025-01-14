import dayjs from 'dayjs'

export const useformatTime = () => {
  const formatTime = (createdAt) => {
    const now = dayjs()
    const formattime = dayjs(createdAt)
    const diffSeconds = now.diff(formattime, 'second')
    const diffMinutes = now.diff(formattime, 'minute')
    const diffHours = now.diff(formattime, 'hour')

    return diffSeconds < 30
      ? `剛剛新增`
      : diffSeconds < 60
        ? `${diffSeconds}秒鐘前`
        : diffMinutes < 60
          ? `${diffMinutes} 分鐘前`
          : diffHours < 24
            ? `${diffHours} 小時前`
            : formattime.format('YYYY-MM-DD HH:mm')
  }

  return { formatTime }
}
