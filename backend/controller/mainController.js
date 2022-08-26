const userScheme = require("../models/userScheme");
const historyScheme = require("../models/historyScheme");
const bcrypt = require("bcrypt");
const defaultPic =
  "https://cdn-icons-png.flaticon.com/512/1053/1053244.png?w=360";
module.exports = {
  getCities: (req, res) => {
    const cities = [
      "Klaipėda",
      "Šiauliai",
      "Panevėžys",
      "Alytus",
      "Marijampolė",
      "Mažeikiai",
      "Jonava",
      "Utena",
      "Kėdainiai",
      "Telšiai",
      "Ukmergė",
      "Visaginas",
      "Tauragė",
      "Plungė",
      "Kretinga",
      "Palanga",
      "Šilutė",
      "Radviliškis",
      "Gargždai",
      "Druskininkai",
      "Rokiškis",
      "Elektrėnai",
      "Kuršėnai",
      "Biržai",
      "Garliava",
      "Vilkaviškis",
      "Jurbarkas",
      "Grigiškės",
      "Raseiniai",
      "Lentvaris",
      "Prienai",
      "Anykščiai",
      "Joniškis",
      "Kaišiadorys",
      "Varėna",
      "Naujoji Akmenė",
      "Kelmė",
      "Šalčininkai",
      "Pasvalys",
      "Kupiškis",
      "Zarasai",
      "Širvintos",
      "Molėtai",
      "Kazlų Rūda",
      "Skuodas",
      "Šakiai",
      "Trakai",
      "Ignalina",
      "Pabradė",
      "Nemenčinė",
      "Švenčionėliai",
      "Šilalė",
      "Pakruojis",
      "Švenčionys",
      "Vievis",
      "Kybartai",
      "Lazdijai",
    ];
    res.send({ cities: cities });
  },
  registerUser: async (req, res) => {
    const user = new userScheme();
    const { name, passwordOne, passwordTwo, gender, birthday, city } = req.body;

    const hashedPass = await bcrypt.hash(passwordOne, 10);
    const age = Math.floor((new Date() - new Date(birthday)) / 31557600000);

    user.pictures.push(defaultPic);
    user.name = name;
    user.password = hashedPass;
    user.gender = gender;
    user.age = age;
    user.city = city;
    user.filter = { xray: "xray" };
    try {
      await user.save();
    } catch (e) {
      console.log("not saved");
    }

    res.send({ success: true, error: "Registration successful" });
  },
  loginUser: async (req, res) => {
    if (req.body.stayOnline) {
      req.session.user = req.body.name;
      res.send({ success: true, error: "Login successful" });
    } else {
      res.send({ success: true, error: "Login successful" });
    }
  },
  getUser: (req, res) => {
    res.send({ user: req.session.user });
  },
  logOut: (req, res) => {
    req.session.user = null;
    res.send({ user: req.session.user });
  },
  getProfile: async (req, res) => {
    let currentUser = "";
    if (!req.session.user) {
      currentUser = req.body.currentUser;
    } else {
      currentUser = req.session.user;
    }
    if (!currentUser) return res.send({ profile: false });
    let currentProfile = await userScheme.findOne({ name: currentUser });
    currentProfile = {
      pictures: currentProfile.pictures,
      name: currentProfile.name,
    };
    res.send({ profile: currentProfile });
  },
  uploadPic: async (req, res) => {
    const { name, imgUrl } = req.body;
    let currentProfile = await userScheme.findOne({ name: name });
    console.log(currentProfile);
    if (currentProfile.pictures[0] === defaultPic) {
      try {
        await userScheme.updateOne({ name: name }, { $pop: { pictures: -1 } });
        await userScheme.updateOne(
          { name: name },
          { $push: { pictures: imgUrl } }
        );
      } catch (e) {
        console.log("not saved");
      }
    } else {
      try {
        await userScheme.updateOne(
          { name: name },
          { $push: { pictures: imgUrl } }
        );
      } catch (e) {
        console.log("not saved");
      }
    }
    res.send({ success: true, profile: currentProfile });
  },
  setFilter: async (req, res) => {
    const { currentUser, city, gender, age } = req.body;
    const currentProfile = await userScheme.findOne({name:currentUser})
    if (currentProfile.pictures.length < 2) return res.send({success: false, error: "You need to upload at least 2 pictures"})
    if (!city || !gender || !age) return res.send({success: false, error: "All 3 critetria need to be present"})
    const newFilter = {
      city,
      gender,
      age,
    };
    try {
      await userScheme.updateOne(
        { name: currentUser },
        { $set: { filter: newFilter } }
      );
      res.send({ success: true });
    } catch (e) {
      console.log("not saved");
    }
  },
  filterUsers: async (req, res) => {
    let currentUser = "";
    if (!req.session.user) {
      currentUser = req.body.currentUser;
    } else {
      currentUser = req.session.user;
    }
    if (!currentUser) return res.send({ success: false });
    const currentProfile = await userScheme.findOne({ name: currentUser });

    const afterFilter = await userScheme.find({
      $and: [
        { city: currentProfile.filter.city },
        { gender: currentProfile.filter.gender },
        { age: currentProfile.filter.age },
      ],
    });
    let uniqueUsers = afterFilter.filter((x) => x.name !== currentUser);
    res.send({ success: true, userMatch: uniqueUsers });
  },
  likeUser: async (req, res) => {
    const { currentUser, likedProfile } = req.body;
    
    const likingUser = await historyScheme.findOne({ user: currentUser });
    const likedUser = await historyScheme.findOne({ user: likedProfile });
    if (!likingUser) {
      const history = new historyScheme();

      history.user = currentUser;
      history.likesMe = [];
      history.iLike.push(likedProfile);

      try {
        await history.save();
      } catch (e) {
        console.log("not saved");
      }
    } else{
      try {
        await historyScheme.updateOne({user: currentUser}, {$addToSet:{iLike: likedProfile}});
      } catch (e) {
        console.log("not saved");
      }
    }
    if(!likedUser) {
      const history = new historyScheme();

      history.user = likedProfile;
      history.likesMe.push(currentUser);
      history.iLike = [];

      try {
        await history.save();
      } catch (e) {
        console.log("not saved");
      }
    } else{
      try {
        await historyScheme.updateOne({user: likedProfile}, {$addToSet:{likesMe: currentUser}});
      } catch (e) {
        console.log("not saved");
      }
    }
    res.send({success: true})
  },
  getHistory: async (req, res) => {
    console.log(req.body)
    let currentUser = "";
    if (!req.session.user) {
      currentUser = req.body.currentUser;
    } else {
      currentUser = req.session.user;
    }
    if (!currentUser) return res.send({ success: false, profile: false });
    const userLikes = await historyScheme.findOne({user :currentUser})
    if(!userLikes) return res.send({success: false, profile:true})
    const iLike = await userScheme.find({name: {$in: userLikes.iLike}})
    const likesMe = await userScheme.find({name: {$in: userLikes.likesMe}})
    res.send({iLike: iLike, likesMe: likesMe, success: true, profile: true })
  },
  removePic: async (req, res) => {
    const{currentUser, img} = req.body
    try {
      await userScheme.updateOne(
        { name: currentUser },
        { $pull: { pictures: img } }
      );
      res.send({ success: true });
    } catch (e) {
      console.log("not saved");
    }
  }
};
