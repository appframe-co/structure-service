import { RoutesInput } from '@/types/types'
import structure from './structure.route'
import schemabricks from './schema-bricks.route'

export default ({ app }: RoutesInput) => {
    app.use('/api/structures', structure);
    app.use('/api/schema_bricks', schemabricks);
};