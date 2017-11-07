import { expect } from 'chai';
import { UtilisateurBase } from './utilisateur-base.js';

describe('UtilisateurBase tests', () => {

    it('should not find the user (empty array)', done => {
        let userbase = new UtilisateurBase();
        expect(false).to.equal(userbase.existe('steve'));
        done();
    });

    it('should not find the user (array not empty)', done => {
        let userbase = new UtilisateurBase();
        userbase.utilisateurs.push('not steve');
        expect(false).to.equal(userbase.existe('steve'));
        done();
    });

    it('should find the user', done => {
        let userbase = new UtilisateurBase();
        userbase.utilisateurs.push('steve');
        expect(true).to.equal(userbase.existe('steve'));
        done();
    });

    it('should add user', done => {
        let userbase = new UtilisateurBase();
        expect(true).to.equal(userbase.ajouterUtilisateur('steve'));
        done();
    });

    it('should not add user', done => {
        let userbase = new UtilisateurBase();
        userbase.utilisateurs.push('steve');
        expect(false).to.equal(userbase.ajouterUtilisateur('steve'));
        done();
    });

    it('should remove user', done => {
        let userbase = new UtilisateurBase();
        userbase.utilisateurs.push('steve');
        expect(true).to.equal(userbase.enleverUtilisateur('steve'));
        done();
    });

    it('should not remove user', done => {
        let userbase = new UtilisateurBase();
        expect(false).to.equal(userbase.enleverUtilisateur('steve'));
        done();
    });
});
