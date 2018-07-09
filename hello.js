let argv = require('yargs')
    .usage('Usage: hello [options]')
    .example('hello -n tom -a beijing', '=>hello tom, welcome to beijing')
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2017')
    .option('n', {
        alias: 'name',
        demand: true,
        default: 'tom',
        describe: 'your name',
        type: 'string'
    })
    .option('a', {
        alias: 'address',
        demand: true,
        default: 'beijing',
        describe: 'your address',
        type: 'string'
    })
    .command("morning", "good morning", function (yargs) {
        let argv = yargs.reset()
            .option("m", {
                alias: "message",
                default: 'Are you hungry?',
                description: "provide any sentence"
            })
            .help("h")
            .alias("h", "help")
            .argv;
        console.log("Good Morning", argv.m);
    })
    .command("evening", "good evening", function (yargs) {
        console.log("Good Evening");
    })
    .argv;
console.log('hello %s, welcome to %s', argv.name, argv.address);
// console.log('other(argv._) =', argv._);
// console.log('process.argv =', process.argv.slice(2));
