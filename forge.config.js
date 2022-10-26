module.exports = {
    "name": "bastion2222",
    "version": "1.0.0",
    "config": {
      "forge": {
        "packagerConfig": {},
        "makers": [
            {
            "name": "@electron-forge/maker-squirrel",
            "config": {
                "name": "bastion2222",
            }
            },
            {
            "name": "@electron-forge/maker-zip",
            "platforms": [
                "darwin"
            ]
            },
            {
            "name": "@electron-forge/maker-deb",
            "config": {}
            },
            {
            "name": "@electron-forge/maker-rpm",
            "config": {}
            }
        ]
      }
    }
  }