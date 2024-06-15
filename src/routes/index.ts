import { RoutesInput } from '@/types/types'
import structure from './structure.route'

export default ({ app }: RoutesInput) => {
    app.use('/api/structures', structure);
};