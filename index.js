const Discord = require('discord.js');
const ms = require('ms');
const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"]
})

client.login("process.env.token");

client.on("ready", () => {
    console.log("ONLINE");
})

client.on("messageCreate", message => {
    if (message.content.startsWith("m!ban")) {
        var utente = message.mentions.members.first();
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.channel.send('Non hai il permesso');
        }
        if (!utente) {
            return message.channel.send('Non hai menzionato nessun utente');
        }
        if (!utente.bannable) {
            return message.channel.send('Io non ho il permesso');
        }
        utente.ban()
            .then(() => {
                var embed = new Discord.MessageEmbed()
                    .setTitle(`${utente.user.username} bannato`)
                    .setDescription(`Utente bannato da ${message.author.toString()}`)

                message.channel.send({ embeds: [embed] })
            })
    }
})

client.on("messageCreate", message => {
    if (message.content.startsWith("m!kick")) {
        var utente = message.mentions.members.first();
        if (!message.member.permissions.has('KICK_MEMBERS')) {
            return message.channel.send('Non hai il permesso');
        }
        if (!utente) {
            return message.channel.send('Non hai menzionato nessun utente');
        }
        if (!utente.kickable) {
            return message.channel.send('Io non ho il permesso');
        }
        utente.kick()
            .then(() => {
                var embed = new Discord.MessageEmbed()
                    .setTitle(`${utente.user.username} kickato`)
                    .setDescription(`Utente kickato da ${message.author.toString()}`)

                message.channel.send({ embeds: [embed] })
            })
    }
})

client.on("messageCreate", message => {
    if (message.content.startsWith("m!mute")) {
        var utente = message.mentions.members.first();
        if (!message.member.permissions.has("MANAGE_ROLES")) {
            return message.channel.send('Non hai il permesso');
        }
        if (!utente) {
            return message.channel.send('Non hai menzionato nessun utente');
        }

        utente.roles.add("idRuolo")

        var embed = new Discord.MessageEmbed()
            .setTitle(`${utente.user.username} mutato`)
            .setDescription(`Utente mutato da ${message.author.toString()}`)

        message.channel.send({ embeds: [embed] })
    }
})

client.on("messageCreate", message => {
    if (message.content.startsWith("m!unmute")) {
        var utente = message.mentions.members.first();
        if (!message.member.permissions.has("MANAGE_ROLES")) {
            return message.channel.send('Non hai il permesso');
        }
        if (!utente) {
            return message.channel.send('Non hai menzionato nessun utente');
        }

        utente.roles.remove("idRuolo")

        var embed = new Discord.MessageEmbed()
            .setTitle(`${utente.user.username} smutato`)
            .setDescription(`Utente smutato da ${message.author.toString()}`)

        message.channel.send({ embeds: [embed] })
    }
})

client.on("messageCreate", async message => {
    if (message.content.startsWith("m!unban")) {
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.channel.send('Non hai il permesso');
        }

        var args = message.content.split(/\s+/);
        var idUtente = args[1]

        if (!idUtente) {
            return message.channel.send("Non hai scritto l'id di nessun utente");
        }

        message.guild.members.unban(idUtente)
            .then(() => {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Utente sbannato")
                    .setDescription("Questo utente è stato sbannato")

                message.channel.send({ embeds: [embed] })
            })
            .catch(() => { message.channel.send("Utente non valido o non bannato") })
    }
})

client.on("messageCreate", message => {
    if (message.content.startsWith("m!avatar")) {
        if (message.content.trim() == "!avatar") {
            var utente = message.member;
        }
        else {
            var utente = message.mentions.members.first();
        }
        if (!utente) {
            return message.channel.send("Utente non trovato")
        }
        var embed = new Discord.MessageEmbed()
            .setTitle(utente.user.tag)
            .setDescription("L'avatar di questo utente")
            .setImage(utente.user.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 512
            }))
        message.channel.send({ embeds: [embed] })
    }
})

client.on("messageCreate", message => {
    if (message.content.startsWith("m!userinfo")) {
        if (message.content == "!userinfo") {
            var utente = message.member;
        }
        else {
            var utente = message.mentions.members.first();
        }
        if (!utente) {
            return message.channel.send("Non ho trovato questo utente")
        }
        var elencoPermessi = "";
        if (utente.permissions.has("ADMINISTRATOR")) {
            elencoPermessi = "👑 ADMINISTRATOR";
        }
        else {
            var permessi = ["CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "ADMINISTRATOR", "MANAGE_CHANNELS", "MANAGE_GUILD", "ADD_REACTIONS", "VIEW_AUDIT_LOG", "PRIORITY_SPEAKER", "STREAM", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "VIEW_GUILD_INSIGHTS", "CONNECT", "SPEAK", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS_AND_STICKERS", "USE_APPLICATION_COMMANDS", "REQUEST_TO_SPEAK", "MANAGE_THREADS", "CREATE_PUBLIC_THREADS", "CREATE_PRIVATE_THREADS", "USE_EXTERNAL_STICKERS", "SEND_MESSAGES_IN_THREADS", "START_EMBEDDED_ACTIVITIES"]
            for (var i = 0; i < permessi.length; i++)
                if (utente.permissions.has(permessi[i]))
                    elencoPermessi += `- ${permessi[i]}\r`
        }
        var embed = new Discord.MessageEmbed()
            .setTitle(utente.user.tag)
            .setDescription("Tutte le info di questo utente")
            .setThumbnail(utente.user.displayAvatarURL())
            .addField("User id", utente.user.id, true)
            .addField("Status", utente.presence ? utente.presence.status : "offline", true)
            .addField("Is a bot?", utente.user.bot ? "Yes" : "No", true)
            .addField("Account created", utente.user.createdAt.toDateString(), true)
            .addField("Joined this server", utente.joinedAt.toDateString(), true)
            .addField("Permissions", elencoPermessi, false)
            .addField("Roles", utente.roles.cache.map(ruolo => ruolo.name).join("\r"), false)
        message.channel.send({ embeds: [embed] })
    }
})

client.on("messageCreate", message => {
    if (message.content.startsWith("m!channelinfo")) {
        if (message.content == "!channelinfo") {
            var canale = message.channel;
        }
        else {
            var canale = message.mentions.channels.first();
        }
        if (!canale) {
            return message.channel.send("Canale non trovato");
        }
        switch (canale.type) {
            case "GUILD_TEXT": canale.type = "Text"; break;
            case "GUILD_VOICE": canale.type = "Voice"; break;
            case "GUILD_CATEGORY": canale.type = "Category"; break;
        }
        if (canale.type == "Voice") {
            var embed = new Discord.MessageEmbed()
                .setTitle(canale.name)
                .setDescription("Tutte le statistiche su questo canale")
                .addField("Channel ID", canale.id, true)
                .addField("Type", canale.type, true)
                .addField("Position", canale.rawPosition.toString(), true)
                .addField("Category", `<#${canale.parentId}>`, true)
                .addField("Bitrate", canale.bitrate.toString(), true)
                .addField("User limit", canale.userLimit == 0 ? "∞" : canale.userLimit.toString(), true)
            return message.channel.send({ embeds: [embed] })
        }
        if (canale.type == "Category") {
            var embed = new Discord.MessageEmbed()
                .setTitle(canale.name)
                .setDescription("Tutte le statistiche su questa categoria")
                .addField("Category ID", canale.id, true)
                .addField("Type", canale.type, true)
                .addField("Position", canale.rawPosition.toString(), true)
                .addField("Category created", canale.createdAt.toDateString())
            return message.channel.send({ embeds: [embed] })
        }
        var embed = new Discord.MessageEmbed()
            .setTitle(canale.name)
            .setDescription("Tutte le statistiche su questo canale")
            .addField("Channel ID", canale.id, true)
            .addField("Type", canale.type, true)
            .addField("Position", canale.rawPosition.toString(), true)
            .addField("Category", `<#${canale.parentId}>`, true)
            .addField("Topic", !canale.topic ? "No topic" : canale.topic, true)
            .addField("NSFW", canale.nsfw ? "Yes" : "No", true)
            .addField("Channel created", canale.createdAt.toDateString())
        message.channel.send({ embeds: [embed] })
    }
})

client.on("messageCreate", message => {
    if (message.content.startsWith("m!clear")) {
        if (!message.member.permissions.has("MANAGE_MESSAGES")) {
            return message.channel.send('Non hai il permesso');
        }
        if (!message.guild.me.permissions.has("MANAGE_MESSAGES")) {
            return message.channel.send('Non ho il permesso');
        }
        var count = parseInt(message.content.split(/\s+/)[1]);
        if (!count) {
            return message.channel.send("Inserisci un numero valido")
        }
        if (count > 100) {
            return message.channel.send("Non puoi cancellare più di 100 messaggi")
        }
        message.channel.bulkDelete(count, true)
        message.channel.send(count + " messaggi eliminati").then(msg => {
            setTimeout(() => msg.delete(), 5000)
        })
    }
})

client.on("messageCreate", message => {
    if (message.content.startsWith("m!roleinfo")) {
        var ruolo = message.mentions.roles.first()
        if (!ruolo) {
            return message.channel.send("Non ho trovato questo ruolo")
        }
        var memberCount = message.guild.members.cache.filter(member => member.roles.cache.find(role => role == ruolo)).size;
        var permessiRuolo = new Discord.Permissions(ruolo.permissions.bitfield);
        var elencoPermessi = "";
        if (permessiRuolo.has("ADMINISTRATOR")) {
            elencoPermessi = "👑ADMINISTRATOR";
        }
        else {
            var permessi = ["CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_GUILD", "ADD_REACTIONS", "VIEW_AUDIT_LOG", "PRIORITY_SPEAKER", "STREAM", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "VIEW_GUILD_INSIGHTS", "CONNECT", "SPEAK", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS"]
            for (var i = 0; i < permessi.length; i++) {
                if (permessiRuolo.has(permessi[i])) {
                    elencoPermessi += `- ${permessi[i]}\r`
                }
            }
        }
        var embed = new Discord.MessageEmbed()
            .setTitle(ruolo.name)
            .setDescription("Tutte le statistiche di questo ruolo")
            .addField("Role ID", ruolo.id, true)
            .addField("Members", memberCount.toString(), true)
            .addField("Color", ruolo.hexColor, true)
            .addField("Role created", ruolo.createdAt.toDateString(), true)
            .addField("Permissions", elencoPermessi, false)
        message.channel.send({ embeds: [embed] })
    }
})

client.on("messageCreate", message => {
    if (message.content == "m!serverinfo") {
        var server = message.guild;
        var embed = new Discord.MessageEmbed()
            .setTitle(server.name)
            .setDescription("Tutte le info su questo server")
            .setThumbnail(server.iconURL())
            .addField("Owner", client.users.cache.get(server.ownerId).username, true)
            .addField("Server id", server.id, true)
            .addField("Members", server.memberCount.toString(), false)
            .addField("Channels", server.channels.cache.size.toString(), false)
            .addField("Server created", server.createdAt.toDateString(), true)
            .addField("Boost level", "Level " + (server.premiumTier != "NONE" ? server.premiumTier : 0) + " (Boost: " + server.premiumSubscriptionCount + ")", true)
        message.channel.send({ embeds: [embed] })
    }
})

client.on("messageCreate", message => {
    if (message.content.startsWith("m!say")) {
        var args = message.content.split(/\s+/);
        var testo;
        testo = args.slice(1).join(" ");
        if (!testo) {
            return message.channel.send("Inserire un messaggio");
        }
        if (message.content.includes("@everyone") || message.content.includes("@here")) {
            return message.channel.send("Non taggare everyone o here");
        }
        message.delete()

        //Messaggio classico
        message.channel.send(testo)

        //Embed
        var embed = new Discord.MessageEmbed()
            .setTitle("Say")
            .setDescription(testo)

        message.channel.send({embeds: [embed]})
    }
})

client.on("messageCreate", message => {
    if (message.content == "m!ping") {
        var embed = new Discord.MessageEmbed()
            .setTitle("Ping del bot")
            .setDescription("Ecco la latenza del bot")
            .addField("Ping", `${client.ws.ping}ms`)

        message.channel.send({embeds: [embed]})
    }
})

client.on("messageCreate", message => {
    if (message.content == "m!invite") {
        var embed = new Discord.MessageEmbed()
            .setTitle("Clicca qui")
            .setDescription("premi su clicca qui per invitarmi :)")
            .setURL("https://discord.com/api/oauth2/authorize?client_id=983747811432603668&permissions=8&scope=bot")

        message.channel.send({embeds: [embed]})
    }
})

client.on("messageCreate", message => {
    if (message.content == "m!prefisso") {
        var embed = new Discord.MessageEmbed()
            .setTitle("Prefisso del bot")
            .setDescription("Ecco il prefisso del bot")
            .addField("prefisso", `m!`)

        message.channel.send({embeds: [embed]})
    }
})


client.on('ready', () => {
    //Stato classico (Sta guardando..., Sta giocando a...)
    client.user.setActivity('m!help', { type: 'WATCHING' }); //Oppure LISTENING, PLAYING
    //Streamimg
    client.user.setStatus('online') //Oppure idle, dnd, invisible
})

client.on("messageCreate", message => {
    if (message.content == "!ciao") {
        let embed = new Discord.MessageEmbed()
            .setTitle("Ciao")

        let button1 = new Discord.MessageButton()
            .setLabel("Cliccami")
            .setStyle("SUCCESS")
            .setCustomId(`clickButton1,${message.author.id}`)

        let row = new Discord.MessageActionRow()
            .addComponents(button1)

        message.channel.send({ embeds: [embed], components: [row] })
    }

    if (message.content == "m!help") {
        let embed = new Discord.MessageEmbed()
            .setTitle("Help")
            .setDescription("Seleziona la pagina con il menu qua sotto")

        let select = new Discord.MessageSelectMenu()
            .setCustomId("menuHelp")
            .setPlaceholder("Seleziona una pagina")
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: "Pagina 1",
                    description: "Vai alla pagina numero 1",
                    value: "pagina1"
                },
                {
                    label: "Pagina 2",
                    description: "Vai alla pagina numero 2",
                    value: "pagina2"
                },
                {
                    label: "Pagina 3",
                    description: "Vai alla pagina numero 3",
                    value: "pagina3"
                }
            ])

        let row = new Discord.MessageActionRow()
            .addComponents(select)

        message.channel.send({ embeds: [embed], components: [row] })
    }
})


client.on("interactionCreate", interaction => {
    if (!interaction.isSelectMenu()) return

    if (interaction.customId == "menuHelp") {
        interaction.deferUpdate()

        switch (interaction.values[0]) {
            case "pagina1": {
                let embed = new Discord.MessageEmbed()
                    .setTitle("MODERAZIONE")
                    .setDescription("ad ogni comando aggiungi il prefisso **m!**")
                    .addField("Ban", `rimuove un utente per sempre`)
                    .addField("Kick", `rimuove un utente`)
                    .addField("mute", `muta un utente`)
                    .addField("unmute", `smuta un utente`)
                    .addField("clear", `elimina i messaggi stabilita dall'utente`)
                    .addField("unban", `sbanna un utente`)




                interaction.message.edit({ embeds: [embed] })
            } break
            case "pagina2": {
                let embed = new Discord.MessageEmbed()
                    .setTitle("UTILI")
                    .setDescription("ad ogni comando aggiungi il prefisso **m!**")
                    .addField("avatar", `visualizzi l'avatar degli utenti`)
                    .addField("useriinfo", `visualizzi i dati di un utente`)
                    .addField("channelinfo", `visualizzi info su un canale da te scelto`)
                    .addField("roleinfo", `visualizzi info su un ruolo del server da te scelto`)
                    .addField("clear", `elimina i messaggi stabilita dall'utente`)
                    .addField("serverifo", `visualizzi le info sul server`)
                    .addField("say", `fai scrivere qualcosa al bot`)
                    


                interaction.message.edit({ embeds: [embed] })
            } break
            case "pagina3": {
                let embed = new Discord.MessageEmbed()
                    .setTitle("INFO BOT")
                    .setDescription("ad ogni comando aggiungi il prefisso **m!**")
                    .addField("invite", `richiedi il link d'invito del bot`)
                    .addField("prefisso", `richiedi il refisso del bot`)
                    .addField("ping", `richiedi la latenza del bot`)
                    .addField("vote", `richiedi il link per votare il bot **(presto disponibile)**`)
                    


                interaction.message.edit({ embeds: [embed] })
            } break
        }
    }
})