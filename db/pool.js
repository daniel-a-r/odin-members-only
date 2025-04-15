import { Pool } from 'pg';
import connectionString from '../config/dbConfig.js';

export default new Pool({ connectionString });
