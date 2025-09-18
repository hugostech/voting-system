const mongoose = require('mongoose');
const Contestant = require('../models/Contestant');
const Admin = require('../models/Admin');
const Vote = require('../models/Vote');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Contestant.deleteMany({});
        await Admin.deleteMany({});
        await Vote.deleteMany({});

        // Create default contestants
        const contestants = [
            {
                name: 'ACKS',
                description: '四个喜欢跳舞的女生聚在一起',
                avatar: 'https://i.ibb.co/mrWBprFm/20250903232908.jpg'
            },
            {
                name: 'Celestia',
                description: '临时起意但毫不随意🤩接下来的舞——难到让地板怀疑人生，炸💣到让镜头📹自动对焦，帅到让观众集体报警🚨！预选过关 = 预定了要选上🎉\n' +
                    '，预定要选上 = 预定了要当冠军🏆。请多多期待吧😚',
                avatar: 'https://i.ibb.co/HDcM3mCs/20250903233607.jpg'
            },
            {
                name: 'Chelsea',
                description: '大家好，我是Chelsea，虽然我们现在还不太熟，不过我的直播间开了空调加热，一会儿我们就熟了。据说镜子是我最忠实的观众，每天都要欣赏66次。平时看起来很酷，其实内心 OS常常是“今晚吃什么”。',
                avatar: 'https://i.ibb.co/0Vcg0p92/20250903232722.jpg'
            },
            {
                name: 'Colin',
                description: '大家好，我是Colin，一个自带“开心 buff”的人！顶级p人，干啥都随缘，经常灵光乍现就改主意了🌚🌚🌚🌚🌚🌚🌚🌚 平时空的时候也喜欢去点新奇的地方逛逛玩玩。我从小就喜欢表演，希望这一次也能和大家一起玩的开心！',
                avatar: 'https://i.ibb.co/Ff8Rmm2/20250905191717.jpg'
            },
            {
                name: 'Jasper',
                description: '大家好，我是Jasper。来了奥克兰以后，只剩下了三种状态。读PhD的时候是土狗，玩抽象的时候是天子，唱歌的时候我就是皇帝。',
                avatar: 'https://i.ibb.co/qFsyYwY9/20250905191058.jpg'
            },
            {
                name: 'Oscar&Jason',
                description: 'Hey！我们是Oscar & Jason。因为Hiphop产生共鸣，所以决定借这次比赛的机会一起做首歌。音乐是我们的朋友，我们向ta表达所有未被言说的情绪。如果我们的歌有某个瞬间打动了你，感谢你那一刻的驻足，那便是我们之间最珍贵的共鸣。',
                avatar: 'https://i.ibb.co/rKfc1Kfh/20250903234340.jpg'
            },
            {
                name: 'Piggy',
                description: '那些打不死我的一直在打我',
                avatar: 'https://i.ibb.co/tTKFpn7W/20250903232303.jpg'
            },
            {
                name: '刘亦菲',
                description: '大家好我叫刘奕菲，自我介绍太难想了，大家能记住我叫刘奕菲就好了。\n' +
                    '\n' +
                    '刘奕菲 刘奕菲 刘奕菲 刘奕菲 刘奕菲\n' +
                    '\n' +
                    '谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢',
                avatar: 'https://i.ibb.co/jNQKbh2/20250903233226-1.jpg'
            },
            {
                name: '大帝',
                description: '大家好我是Dadi，也可以叫我Daddy，有人说我长得像迪丽热巴（我自己，所以你也可以叫我巴巴。喜欢唱歌，占人便宜。最不喜欢睡觉，我的人生格言是生前何必多睡，死后自会长眠。',
                avatar: 'https://i.ibb.co/tSLvrtb/20250903233740.jpg'
            },
            {
                name: '熊伟鑫',
                description: 'Hello，我是Tiger，这个名字可能有点怪，实在不行就叫“虎子”吧~参加这个活动主要还是比较喜欢唱歌，反正自己唱的开心就好，也没想别的。如果大家能唱又能喝就最好啦~别的就没有什么了，大家开心就好',
                avatar: 'https://i.ibb.co/DfShGZ3d/20250903231647.jpg'
            },
            {
                name: '鸟巢没有信号乐队',
                description: '鸟巢没有信号乐队 Bird Nest with No Signal\n' +
                    '\n' +
                    '我们五个人来自不同的地方，但在音浪里找到同一个频率。两位女生担任主唱与贝斯，三位男生撑起鼓点和吉他。\n' +
                    '\n' +
                    '我们叫“鸟巢没有信号”，因为我们组队那天真的是在鸟巢楼下蹲着抢WIFI。信号很差，但那天的感觉很对。\n' +
                    '\n' +
                    '后来我们想，反正也不靠信号。\n' +
                    '\n' +
                    '鸟巢没有信号，但我们，从不掉线。',
                avatar: 'https://i.ibb.co/whvY2T8N/image.jpg'
            },
        ];

        await Contestant.insertMany(contestants);
        console.log('Contestants created successfully');
        // Create default admin
        const admin = new Admin(
            {
                email: 'zhouruijia2002@gmail.com',
                password:  'admin123',
                voteWeight: 20
            }
        );
        await admin.save();

        const admin2 = new Admin({
            email: 'yejabeatbox@gmail.com',
            password:  'admin123',
            voteWeight: 20
        });
        await admin2.save();

        const admin3 = new Admin({
            email: 'venusartsun@qq.com',
            password:  'admin123',
            voteWeight: 20
        });
        await admin3.save();

        const admin4 = new Admin({
            email: 'rita0410zhao@gmail.com',
            password:  'admin123',
            voteWeight: 20
        });
        await admin4.save();

        const admin5 = new Admin({
            email: 'hugowangchn@gmail.com',
            password:  'admin123',
            voteWeight: 20
        });
        await admin5.save();

        const admin6 = new Admin({
            email: 'info@mehome.co.nz',
            password:  'admin123',
            voteWeight: 20
        })

        await admin6.save();

        const admin7 = new Admin({
            email: 'jack.zhu@nzcsa.com',
            password:  'admin123',
            voteWeight: 20
        })
        await admin7.save();




        console.log('Admin user created successfully');

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedData();