import {Connection, FieldPacket, OkPacket, ResultSetHeader, RowDataPacket} from 'mysql2/promise';
import {DatabaseConnectionConfig, DatabaseConnectionInputConfig} from './database-config';
import {handleWithConnection} from './database-connection';

type InnerQueryResult = [
    RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[] | ResultSetHeader,
    FieldPacket[],
];
type FormattedQueryResult = [
    (RowDataPacket[] | RowDataPacket | OkPacket | ResultSetHeader)[],
    FieldPacket[],
];

export type QueryResult = Readonly<{
    result: FormattedQueryResult;
    config: DatabaseConnectionConfig;
    connection: Connection | undefined;
}>;

function formatQueryResult(inputResult: InnerQueryResult): FormattedQueryResult {
    const firstEntry = inputResult[0];

    const formattedFirstEntry = Array.isArray(firstEntry) ? firstEntry : [firstEntry];

    return [formattedFirstEntry, inputResult[1]];
}

export async function rawQuery(
    sql: string,
    values: any[],
    configInput: DatabaseConnectionInputConfig,
    connectionInput: Connection | undefined,
) {
    return handleWithConnection(connectionInput, configInput, async (connection, config) => {
        const result = formatQueryResult(await connection.query(sql, values));

        const returnValue: QueryResult = {
            result,
            config,
            connection: connectionInput,
        };

        return returnValue;
    });
}
