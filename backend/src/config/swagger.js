import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
        definition: {
                openapi: '3.0.0',
                info: {
                        title: "Security Learning Platform API",
                        version: '1.0.0',
                        description: "보안 학습 플랫폼 API 문서"
                },
                servers: [
                        { url: 'https://hacknlearn.site', description: '로컬 서버' },
                ],
        },
        apis: ['./src/routes/*.js', './src/models/*.js'], // 라우트 및 모델 파일에서 주석을 읽어들임
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };