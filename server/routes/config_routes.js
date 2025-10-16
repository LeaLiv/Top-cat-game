import leadboardRouter from './leadboard.js';


export const routesInit = (app) => {
    app.use('/leadboard', leadboardRouter);
}