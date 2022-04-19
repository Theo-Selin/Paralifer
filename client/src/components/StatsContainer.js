import { useAppContext } from '../context/appContext'
import StatItem from './StatItem'
import { FaClock, FaWalking, FaCheck } from 'react-icons/fa'
import Wrapper from '../assets/wrappers/StatsContainer'

const StatsContainer = () => {
  const { stats } = useAppContext()

  const defaultStats = [
    {
      title: 'pending',
      count: stats.pending || 0,
      icon: <FaClock />,
      color: '#e9b949',
      bcg: '#fcefc7',
    },
    {
      title: 'started',
      count: stats.started || 0,
      icon: <FaWalking />,
      color: '#647acb',
      bcg: '#e0e8f9',
    },
    {
      title: 'finished',
      count: stats.finished || 0,
      icon: <FaCheck />,
      color: '#50C878',
      bcg: '#ffeeee',
    },
  ]

  return (
    <Wrapper>
      {defaultStats.map((item, index) => {
        return <StatItem key={index} {...item} />
      })}
    </Wrapper>
  )
}

export default StatsContainer