const weapon = require('../models/weapon');
const dbConfig = require('../config/dbConfig');

describe('End to End Test', () => {

    let weaponId;

    test('create a weapon with materials', async () => {
        const name = 'QA Stick';
        const id = 4;
        const materials = [{ id: 1 }, { id: 9 }];
    
        await dbConfig('weapons')
            .insert({id, name, power_level: 0, status: 'new' });
    
        const insertedWeapon = await dbConfig('weapons')
            .where({ name })
            .first();
    
        if (!insertedWeapon) {
            throw new Error('Weapon creation failed');
        }
        weaponId = insertedWeapon.id;    

        await dbConfig('weapons_materials').insert(  [{ id: 8, weapon_id: 4, material_id: 1 },
            { id: 9, weapon_id: 4, material_id: 9 }])
        
        const dbWeaponMaterials = await dbConfig('weapons_materials')
            .where({ weapon_id: insertedWeapon.id });
    
        expect(insertedWeapon.id).toBe(weaponId);
        expect(insertedWeapon.name).toBe(name);
        expect(dbWeaponMaterials.length).toBe(materials.length);
        expect(dbWeaponMaterials[0].weapon_id).toBe(insertedWeapon.id);
        expect(dbWeaponMaterials[0].material_id).toBe(materials[0].id);
        expect(dbWeaponMaterials[1].weapon_id).toBe(insertedWeapon.id);
        expect(dbWeaponMaterials[1].material_id).toBe(materials[1].id);
    });

    test('calculate the power level of the weapon', async () => {
        const result = await dbConfig.raw(`
            WITH RECURSIVE material_hierarchy AS (
                SELECT
                    mw.material_id,
                    m.power_level AS base_power_level,
                    m.power_level * 1 AS weighted_power_level,
                    1 AS cumulative_qty
                FROM
                    weapons_materials mw
                JOIN
                    materials m ON mw.material_id = m.id
                WHERE
                    mw.weapon_id = ?
    
                UNION ALL
                SELECT
                    c.material_id,
                    m.power_level AS base_power_level,
                    m.power_level * mh.cumulative_qty * c.qty AS weighted_power_level,
                    mh.cumulative_qty * c.qty AS cumulative_qty
                FROM
                    material_hierarchy mh
                JOIN
                    compositions c ON mh.material_id = c.parent_id
                JOIN
                    materials m ON c.material_id = m.id
            )
            SELECT
                COALESCE(SUM(weighted_power_level), 0) AS total_power_level
            FROM
                material_hierarchy
        `, [weaponId]);
    
        const totalPowerLevel = Number(result.rows[0].total_power_level);
        const response = await weapon.getPowerLevel(weaponId);
    
        expect(response).toBe(totalPowerLevel);
    });

    afterAll(async () => {
        await dbConfig('weapons_materials').where({ weapon_id: weaponId }).del();
        await dbConfig('weapons').where({ id: weaponId }).del();
    });

});
