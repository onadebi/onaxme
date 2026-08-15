import dotenv from 'dotenv';
dotenv.config();

const appsettings = {
    appName: 'Onadebi',
    appKey: 'OnaxAppKey',
    appUrl: process.env.APP_URL || 'http://localhost:4500',
    PORT: Number(process.env.PORT) || 4500,
    NODE_ENV: process.env.ENV || 'development',
    Layouts: {
        PublicDefault: '../views/layouts/public',
    },
    FileUploadedConstraints:{
        images: ['image/jpeg', 'image/png', 'image/gif','video/mp4','video/webm','video/avi','video/mpeg','video/ogg','video/x-ms-wmv','video/x-flv','video/3gpp','video/3gpp2','video/x-matroska'],
    },
    cache_config: {
        url: 'redis://localhost:6379',
        prefix: 'OnaxApp'
    },
    DB: {
        username: process.env.DB_user,
        host: process.env.DB_Server,
        database: process.env.DB_database,
        password: process.env.DB_Password,
        port: process.env.DB_Port || 5432,
        synchronize: true,
        logging: false,

        DbConStr: process.env.DbConStr || '',
    },
    route:{
        blog:{
            postRoute:(path :string)=> `/blog/post/${path}`,
            blogRoute:() => `/blog`
        }
    }
}

export default appsettings;