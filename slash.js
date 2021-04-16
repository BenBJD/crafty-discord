import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

let url = "https://discord.com/api/v8/applications/831649008485269526/guilds/691371409561354250/commands"

let json = {
    "name": "crafty",
    "description": "Control Crafty",
    "options": [
        {
            "name": "restart",
            "description": "Restart the server",
            "type": 1,
            "options": [
                {
                    "name": "server-id",
                    "description": "Server ID",
                    "type": 4,
                    "required": true

                }
            ]
        },
        {
            "name": "list-players",
            "description": "List online players",
            "type": 1,
            "options": [
                {
                    "name": "server-id",
                    "description": "Server ID",
                    "type": 4,
                    "required": true
                }
            ]
        },
        {
            "name": "status",
            "description": "View server status",
            "type": 1,
            "options": [
                {
                    "name": "server-id",
                    "description": "Server ID",
                    "type": 4,
                    "required": true
                }
            ]
        },
        {
            "name": "list-servers",
            "description": "List servers",
            "type": 1,
        },
        {
            "name": "command",
            "description": "Execute command on server",
            "type": 1,
            "options": [
                {
                    "name": "command-name",
                    "description": "Command to execute",
                    "type": 3,
                    "required": true
                },
                {
                    "name": "server-id",
                    "description": "Server ID",
                    "type": 4,
                    "required": true
                }
            ]
        }
    ]
}

let headers = {
    "Authorization": "Bot " + process.env.BOT_TOKEN
}

// axios({method: "GET", url: url, headers: headers})
//     .then(response => console.log(response.data))

axios({method: "POST", url: url, data: json, headers: headers})
    .then(response => console.log(response.data))
